const express = require('express');
const router = express.Router();
const {handleHomePage, handleShowAllUrls} = require('../controllers/home');

router.get('/', handleHomePage);

module.exports = router;
