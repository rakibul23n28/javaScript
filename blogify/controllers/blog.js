const Blog = require('../models/blog');
const Comment = require('../models/comment');

function blogAddNew(req, res) {
    res.render('addblog', {
        title: "Blog | Add",
        user: req.user
    });
}

async function handleNewAddedBlog(req, res) {
    const { title = [], description = [], CopyFileidFortextORCode = [] } = req.body;
    const coverImageURLs = req.files ? req.files.map(file => `/uploads/${file?.filename}`) : [];

    // Create arrays for orders
    const titleOrders = req.body.title_order;
    const descriptionOrders = req.body.description_order;
    const CopyFileidFortextORCodeOrders = req.body.CopyFileidFortextORCode_order;
    const coverImageOrders = req.body.coverImage_order;

    // Create an array of fields with their orders
    const fields = [
        ...title.map((t, i) => ({ key: 'title', value: t, order: titleOrders[i] })),
        ...description.map((d, i) => ({ key: 'description', value: d, order: descriptionOrders[i] })),
        ...CopyFileidFortextORCode.map((c, i) => ({ key: 'CopyFileidFortextORCode', value: c, order: CopyFileidFortextORCodeOrders[i] })),
        ...coverImageURLs.map((url, i) => ({ key: 'coverImageURL', value: url, order: coverImageOrders[i] }))  // Order for coverImageURL
    ];

    // Sort fields by order before saving
    fields.sort((a, b) => a.order - b.order);

    // Remove the order property from the fields
    const sortedFields = fields.map(({ key, value }) => ({ key, value }));

    // Create and save the new blog post
    const newBlog = new Blog({
        fields: sortedFields,
        createdBy: req.user._id
    });

    try {
        await newBlog.save();
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
            title: `Blog ${blog.title}`,
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
