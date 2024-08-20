const {Router} = require('express');
const {redirectIfAuthenticate} = require('../middlewares/authentication')
const Blog = require('../models/blog')
const Like = require('../models/like')
const TimeSpent = require("../models/timeSpent");

const router = Router();

router.get("/",async (req, res) => {
    try {
        const blogs = await Blog.find({}).populate('createdBy').exec();
        // Calculate like counts for each blog
        const blogsWithLikes = await Promise.all(blogs.map(async (blog) => {
            const likeCount = await Like.countDocuments({ blogID: blog._id });
            return {
                ...blog.toObject(),
                likeCount
            };
        }));
        blogsWithLikes.sort((a, b) => b.likeCount - a.likeCount);

        res.render('index', { 
            title: 'Home', 
            user: req.user, 
            blogs: blogsWithLikes 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
  });


router.get('/signup', redirectIfAuthenticate, (req, res) => {
res.render('signup',{ title: 'Sign Up' ,user: req.user});
});

router.get('/login',redirectIfAuthenticate, (req, res) => {
res.render('login',{ 
    title: 'Login',
    user: req.user
    });
});

module.exports = router;