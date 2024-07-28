const {Router} = require('express');
const {redirectIfAuthenticate} = require('../middlewares/authentication')
const Blog = require('../models/blog')
const router = Router();

router.get("/",async (req, res) => {
    try {
        const blogs = await Blog.find().populate('createdBy').exec();
        res.render('index', { 
          title: 'Home',
          user: req.user,
          blogs: blogs
         });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
  });
router.get('/signup', redirectIfAuthenticate, (req, res) => {
res.render('signup',{ title: 'Sign Up' });
});

router.get('/login',redirectIfAuthenticate, (req, res) => {
res.render('login',{ 
    title: 'Login',
    });
});

module.exports = router;