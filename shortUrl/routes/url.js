const express = require('express')
const router = express.Router();
const {handleGenerateNewShortId, handleGetShortUrl,handleGetAnalytics,handleDeleteUrl} = require('../controllers/url');

router.post('/',handleGenerateNewShortId);
router.get('/:shortId',handleGetShortUrl );
router.get('/analytics/:shortId',handleGetAnalytics );
router.get('/delete/:shortId',handleDeleteUrl );


module.exports = router