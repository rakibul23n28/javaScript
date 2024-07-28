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

    console.log(imageUrl);
    await Blog.create({
        title: title,
        body: body,
        createdBy: req.user_id,
        coverImageURL: imageUrl
    })
    res.json(await Blog.find());
}


module.exports = {
    blogAddNew,
    handleNewAddedBlog,
}