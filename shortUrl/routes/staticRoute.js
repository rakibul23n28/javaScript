const express = require('express');
const {restrictTo,redirectIfAuthenticated} = require("../middlewares/auth")
const URL = require('../models/url');
const router = express.Router();

router.get('/',restrictTo(['NORMAL','ADMIN']),async (req, res) =>{
    const urls = await URL.find({createdBy: req.user?._id});
    const id = urls?.at(-1)?.shortId;
    res.render('home', {
        id:id,
        title: 'Home',
        urls: urls,
        user: req.user
    });
});
router.get('/signup',redirectIfAuthenticated,(req, res) =>{
    res.render('signup',{
        title: 'Sign Up'
    });
});
router.get('/login',redirectIfAuthenticated,(req, res) =>{
    res.render('login',{
        title: 'Login'
    });
});

module.exports = router;
