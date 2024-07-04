const express = require('express')
const router = express.Router();
const {handleGenerateNewShortId, handleGetShortUrl,handleGetAnalytics} = require('../controllers/url');

router.post('/',handleGenerateNewShortId);
router.get('/:shortId',handleGetShortUrl );
router.get('/analytics/:shortId',handleGetAnalytics );

module.exports = router