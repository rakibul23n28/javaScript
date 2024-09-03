const express = require('express');
const router = express.Router();

const Blog = require('../models/blog');

router.get('/:blogID', async(req, res) => {
    res.render('activity', { 
        title: 'Activity Report',
        blogID: req.params.blogID,
        user: req.user
     });
});

module.exports = router;