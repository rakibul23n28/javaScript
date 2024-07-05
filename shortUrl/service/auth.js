// const sessionIdToUserMap = new Map(); //statefull
const secret = process.env.SECRET_KEY || "helloworld"; //stateless
const jwt = require('jsonwebtoken');

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email
    },secret);
}

function getUser(token) {
    if(!token) return null;
    try{
        return jwt.verify(token,secret);
    }catch(err) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser,
}
