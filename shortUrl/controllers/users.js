const User = require('../models/users');
const {v4: uuidv4} = require("uuid");
const {setUser,getUser} = require('../service/auth');

async function handleRegister(req, res) {
    const body = req.body;
    if(!body.email || !body.password || !body.firstName || !body.lastName) {
        return res.status(400).json({
            status: 400,
            massage: "email, password, firstName and lastName are required"
        });
    }else {
        await User.create(body);
        res.redirect('/');
    }
}
async function handleLogin(req, res) {
    const body = req.body;
    if(!body.email || !body.password) {
        return res.status(400).json({
            status: 400,
            massage: "email and password are required"
        });
    }else {
        const user = await User.findOne({email: body.email});
        if(!user) {
            return res.status(400).json({
                status: 400,
                massage: "user not found"
            });
        }else {
            if(user.password !== body.password) {
                return res.status(400).json({
                    status: 400,
                    massage: "password is wrong"
                });
            }else {
                const sessioId = uuidv4();
                setUser(sessioId, user);
                res.cookie('uid', sessioId);
                res.redirect('/');
            }
        }
    }
}

module.exports = {
    handleRegister,
    handleLogin
}