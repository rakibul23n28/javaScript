const express = require('express');
const URL = require('../models/url');
const router = express.Router();

router.get('/',async (req, res) =>{
    if(!req.user) return res.redirect('/login');
    const urls = await URL.find({createdBy: req.user._id});
    res.render('home', {
        title: 'Home',
        urls: urls,
    });
});
router.get('/signup',(req, res) =>{
    res.render('signup');
});
router.get('/login',(req, res) =>{
    res.render('login');
});

module.exports = router;
