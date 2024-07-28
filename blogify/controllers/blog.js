const Blog = require('../models/blog');

function blogAddNew(req,res){
    res.render('addblog',{
        title: "Blog | Add",
        user: req.user
    })
}
async function handleNewAddedBlog(req,res){
    const {title,body} = req.body;

    const imageUrl = `/uploads/${req.file?.filename}`;

    await Blog.create({
        title: title,
        body: body,
        createdBy: req.user._id,
        coverImageURL: imageUrl
    })
    res.redirect('/');
}
async function BlogRenderByID(req, res) {
    try {
        const id = req.params.blogID;
        const blog = await Blog.findById(id).populate('createdBy').exec();

        if (!blog) {
            return res.status(404).send('Blog not found');
        }

        res.render('bloginfo', {
            title: `Blog ${blog.title}`,
            blog: blog,
            user:req.user
        });
    } catch (err) {
        res.redirect('/');
    }
}

module.exports = {
    blogAddNew,
    handleNewAddedBlog,
    BlogRenderByID,
}