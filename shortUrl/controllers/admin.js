const URL = require('../models/url');
const User = require('../models/users');

async function handleAllUrls(req, res) {
    const urls = await URL.find({});
    res.render('home', {
        id: undefined,
        title: 'Admin | Urls',
        urls: urls,
    });
}
async function handleAllUsers(req, res) {
    const users = await User.find({});
    res.render('users', {
        id: undefined,
        title: 'Admin | Users',
        users: users,
    });
}
async function handleDeleteUsers(req, res) {
    const id = req.params.id;
    const u = await User.findOne({ _id: id });  
    if( u.role == 'ADMIN') {
        return res.redirect('/admin/users');
    }
    await User.findByIdAndDelete(id);

    res.redirect('/admin/users');
}


module.exports = {
    handleAllUrls,
    handleAllUsers,
    handleDeleteUsers
}