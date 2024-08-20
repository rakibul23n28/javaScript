
const Blog = require('../models/blog');
const Comment = require('../models/comment');
const Like = require('../models/like');
const TimeSpent = require('../models/timeSpent');
const Tag = require('../models/tag');

const fs = require('fs');
const path = require('path');

async function blogAddNew(req, res) {
    const tags = await Tag.find({});
    res.render('addblog', {
        title: "Add Blog",
        user: req.user,
        tags,
    });
}
async function handleNewAddedBlog(req, res) {
    const { title, body , tags , subtitle } = req.body;
    const imageUrl = `/uploads/${req.file?.filename}`;
    const allTags = tags.split(',').map((tag) => tag.trim());
    


    const usedImages = extractImageUrls(body);

    // Delete unused images
    if (req.session.uploadedImages) {
        req.session.uploadedImages.forEach((imageUrl) => {
            if (!usedImages.includes(imageUrl)) {
                deleteImageFromServer(imageUrl);
            }
        });

        // Clear the session storage for uploaded images
        req.session.uploadedImages = null;
    }

    try {
        const newBlog = await Blog.create({
            title: title,
            body: body,
            subTitle: subtitle,
            tags: allTags,
            createdBy: req.user._id,
            coverImageURL: imageUrl
        });
        res.redirect('/blog/' + newBlog._id);
    } catch (err) {
        console.error('Error saving blog:', err);
        res.status(500).send('Error saving blog');
    }
}

// Helper function to extract image URLs from the content
function extractImageUrls(content) {
    const regex = /<img[^>]+src="([^">]+)"/g;
    const urls = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]);
    }
    return urls;
}

// Helper function to delete an image from the server
function deleteImageFromServer(imageUrl) {
    const filePath = path.join(__dirname, '../public', imageUrl); // Adjusting the path to point to the public directory
    
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`Failed to delete image: ${filePath}`, err);
        }
    });
}


async function BlogRenderByID(req, res) {
    try {
        const id = req.params.blogID;
        const blog = await Blog.findById(id).populate('createdBy').exec();

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        const comments = await Comment.find({ blogID: id }).populate('createdBy').exec();
        const likes = await Like.find({ blogID: id });

        //user liked or not
        let liked = false;
        let countlike = 0;
        if (req.user) {
            liked = likes.some((like) => like.createdBy.toString() === req.user._id.toString());
            countlike = likes.length;
        }
        res.render('bloginfo', {
            title: `Blog | ${blog.title}`,
            blog: blog,
            user: req.user,
            comments: comments,
            countlike: countlike,
            liked: liked
        });
    } catch (err) {
        console.error('Error rendering blog by ID:', err);
        res.redirect('/');
    }
}
async function renderOwnBlogs(req,res) {
    try {
        const blogs = await Blog.find({createdBy: req.user._id}).populate('createdBy').exec();
        // Calculate like counts for each blog
        const blogsWithLikes = await Promise.all(blogs.map(async (blog) => {
            const likeCount = await Like.countDocuments({ blogID: blog._id });
            return {
                ...blog.toObject(),
                likeCount
            };
        }));

        res.render('ownblogs', { 
            title: 'My Blogs', 
            user: req.user, 
            blogs: blogsWithLikes 
        });
    } catch (err) {
        console.error('Error rendering own blogs:', err);
        res.status(500).send('Internal Server Error');
    }
    
}

// async function postCommentSave(req, res) {
//     try {
//         const { comment } = req.body;
//         console.log(req.query.q);
        
//         const blogID = req.params.blogID;

//         await Comment.create({
//             comment: comment,
//             blogID: blogID,
//             createdBy: req.user._id
//         });

//         res.redirect(`/blog/${blogID}`);
//     } catch (err) {
//         console.error('Error saving comment:', err);
//         res.status(500).send('Internal Server Error');
//     }
// }

async function EditBlog(req,res){
    
    try{
        const id = req.params.blogID;
        const blog = await Blog.findById(id).populate('createdBy').exec();
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        const comments = await Comment.find({ blogID: id }).populate('createdBy').exec();

        res.render('editBlog',{
            title: 'Blog | Edit',
            user:req.user,
            blog,
            comments
        });
    }catch (err) {
        console.error('Error saving comment:', err);
        res.status(500).send('Internal Server Error');
    }
      
}

async function handleEditBlog(req,res) {
    try {

        const id = req.params.blogID;
           
        const { title, body, subtitle } = req.body;

        const usedImages = extractImageUrls(body);
         // Delete unused images
        if (req.session.uploadedImages) {
            req.session.uploadedImages.forEach((imageUrl) => {
                if (!usedImages.includes(imageUrl)) {
                    deleteImageFromServer(imageUrl);
                }
            });

            // Clear the session storage for uploaded images
            req.session.uploadedImages = null;
        }
        
        let blog = await Blog.findById(id);        
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        // Handle cover image update if a new image is uploaded
        if (req.file) {
            // Delete the cover image file if it exists
            if (blog.coverImageURL) {
                const imagePath = path.resolve(`./public${blog.coverImageURL}`);
                
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error('Error deleting cover image:', err);
                    }
                });
            }
            blog.coverImageURL = `/uploads/${req.file.filename}`;
        }

        blog.title =title;
        blog.subTitle =subtitle;
        blog.body =body;

        // Save the updated blog to the database
        await blog.save();
        
        // Redirect to the updated blog's page
        res.redirect(`/blog/${id}`);
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).send('Internal Server Error');
    }
    
}

async function handleDeleteBlog(req, res) {
    try {
        const id = req.params.blogID;

        await Comment.deleteMany({blogID:id});

        await Like.deleteMany({blogID:id});

        await TimeSpent.deleteMany({blogID:id});
        
        // Find and delete the blog by its ID
        const blog = await Blog.findByIdAndDelete(id);
        
        if (!blog) {
            return res.status(404).send('Blog not found');
        }
        const usedImages = extractImageUrls(blog.body);
        
         // Delete unused images
        if (usedImages) {
            usedImages.forEach((imageUrl) => {
                const filePath = path.join(__dirname, '../public', imageUrl);
    
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete image: ${filePath}`, err);
                    }
                });
            });
        }

        // Delete the cover image file if it exists
        if (blog.coverImageURL) {
            const imagePath = path.resolve(`./public${blog.coverImageURL}`);
            
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting cover image:', err);
                }
            });
        }

        res.redirect('/');  
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    blogAddNew,
    handleNewAddedBlog,
    BlogRenderByID,
    // postCommentSave,
    EditBlog,
    handleEditBlog,
    handleDeleteBlog,
    renderOwnBlogs,
};
