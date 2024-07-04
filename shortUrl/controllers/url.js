const URL = require('../models/url');
const {nanoid} = require('nanoid');

async function handleGenerateNewShortId(req, res) {
    const body = req.body;
    if(!body.url) {
        return res.status(400).json({
            status: 400,
            massage: "url is required"
        });
    }
    const shortID = nanoid(8);
    await URL.create({
        shortId : shortID,
        redirectUrl : body.url,
        visitHistory : [],
        createdBy : req.user._id
    });
    // res.redirect('/');
    res.render('home',{
        id: shortID,
        title: 'Home',
        urls: await URL.find({createdBy: req.user._id}),
    })
}
async function handleGetShortUrl(req, res) {
    const shortId = req.params.shortId;
    const url = await URL.findOneAndUpdate(
        {
            shortId: shortId
        },
        {
            $push:{
                visitHistory: {
                    timestamp: Date.now()
                }
            }
        });
        if(!url) {
            return res.status(400).json({
                status: 400,
                massage: "short id do not exist"
            });
        }
    res.redirect(url.redirectUrl);
}
async function handleGetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const url = await URL.findOne({shortId: shortId});
    return res.status(200).json({
        totalVisits: url.visitHistory.length,
        visitHistory: url.visitHistory
    });
}

module.exports = {
    handleGenerateNewShortId,
    handleGetShortUrl,
    handleGetAnalytics,
}