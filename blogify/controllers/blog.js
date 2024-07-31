const Blog = require('../models/blog');
const Comment = require('../models/comment');

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

module.exports = {
    blogAddNew,
    handleNewAddedBlog,
    BlogRenderByID,
    postCommentSave
};
