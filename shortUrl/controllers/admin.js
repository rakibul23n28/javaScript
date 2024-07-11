const URL = require('../models/url');
const User = require('../models/users');

async function handleAllUrls(req, res) {
    const urls = await URL.find().lean();
    const users = await User.find().lean();
    res.render('adminurls', {
        title: 'Admin | Urls',
        urls: urls,
        users: users
    });
}
async function handleAllUsers(req, res) {
    const users = await User.find().lean();
    const urls = await URL.find().lean();
    const countUrls = urls.reduce((map,url)=>{
        map[url.createdBy] = (map[url.createdBy] || 0) + 1;
        return map
    },{});
    res.render('users', {
        title: 'Admin | Users',
        users: users,
        countUrls: countUrls
    });
}
async function handleDeleteUsers(req, res) {
    const id = req.params.id;
    await URL.deleteMany({createdBy: id});
    const u = await User.findOne({ _id: id });  
    if( u.role == 'ADMIN') {
        return res.redirect('/admin/users');
    }
    await User.findByIdAndDelete(id);

    res.redirect('/admin/users');
}

async function handleDeleteUrls(req, res) {
    const shortId = req.params.shortId;
    const url = await URL.findOneAndDelete({shortId: shortId});
    if(!url) {
        return res.status(400).json({
            status: 400,
            massage: "short id do not exist"
        });
    }
    return res.redirect('/admin/urls');
}


module.exports = {
    handleAllUrls,
    handleAllUsers,
    handleDeleteUsers,
    handleDeleteUrls
}