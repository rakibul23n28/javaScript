const express = require('express');
const router = express.Router();

const Blog = require('../models/blog');

router.get('/:blogID', async(req, res) => {
    res.render('activity', { blogID: req.params.blogID });
});

module.exports = router;