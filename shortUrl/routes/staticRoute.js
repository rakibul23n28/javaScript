const express = require('express');
const {restrictTo} = require("../middlewares/auth")
const URL = require('../models/url');
const router = express.Router();

router.get('/',restrictTo(['NORMAL','ADMIN']),async (req, res) =>{
    const urls = await URL.find({createdBy: req.user?._id});
    const id = urls?.at(-1)?.shortId;
    res.render('home', {
        id:id,
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
router.get('/admin/urls',restrictTo(['ADMIN']),async (req, res) =>{
    res.render('home',{
        title: 'Admin | Urls',
        urls: await URL.find({}),
    });
});
module.exports = router;
