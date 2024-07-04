const URL = require('../models/url');

async function handleHomePage(req, res) {
    const urls = await URL.find(); // get all urls
    res.render('home', {
        title: 'Home',
        urls: urls,
    });
}
module.exports = {
    handleHomePage,
    
}
