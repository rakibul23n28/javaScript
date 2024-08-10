const Blog = require('../models/blog');
const Comment = require('../models/comment');

const fs = require('fs');
const path = require('path');

function blogAddNew(req, res) {
    res.render('addblog', {
        title: "Blog | Add",
        user: req.user
    });
}

async function handleNewAddedBlog(req, res) {
    const { title, body } = req.body;
    const imageUrl = `/uploads/${req.file?.filename}`;

    try {
        const newBlog = await Blog.create({
            title: title,
            body: body,
            createdBy: req.user._id,
            coverImageURL: imageUrl
        });
        res.redirect('/blog/' + newBlog._id);
    } catch (err) {
        console.error('Error saving blog:', err);
        res.status(500).send('Error saving blog');
    }
}




async function BlogRenderByID(req, res) {
    try {
        const id = req.params.blogID;
        const blog = await Blog.findById(id).populate('createdBy').exec();

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        const comments = await Comment.find({ blogID: id }).populate('createdBy').exec();
        res.render('bloginfo', {
            title: `Blog | ${blog.title}`,
            blog: blog,
            user: req.user,
            comments: comments
        });
    } catch (err) {
        console.error('Error rendering blog by ID:', err);
        res.redirect('/');
    }
}

async function postCommentSave(req, res) {
    try {
        const { comment } = req.body;
        const blogID = req.params.blogID;

        await Comment.create({
            comment: comment,
            blogID: blogID,
            createdBy: req.user._id
        });

        res.redirect(`/blog/${blogID}`);
    } catch (err) {
        console.error('Error saving comment:', err);
        res.status(500).send('Internal Server Error');
    }
}

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
        let blog = await Blog.findById(id);
        
        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        // Update blog fields with data from the form
        blog.title = req.body.title;
        blog.body = req.body.body;

        // Handle cover image update if a new image is uploaded
        if (req.file) {
            blog.coverImageURL = `/uploads/${req.file.filename}`;
        }

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
        
        // Find and delete the blog by its ID
        const blog = await Blog.findByIdAndDelete(id);
        
        if (!blog) {
            return res.status(404).send('Blog not found');
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

        // Redirect to the blog list or homepage after successful deletion
        res.redirect('/');  // Assuming '/blogs' is your blog list route
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    blogAddNew,
    handleNewAddedBlog,
    BlogRenderByID,
    postCommentSave,
    EditBlog,
    handleEditBlog,
    handleDeleteBlog,
};
