const JWS = require('jsonwebtoken');
const secret = 'superhero';

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        name: user.firstName +" "+ user.lastName,
        role: user.role
    }
    const token = JWS.sign(payload,secret);
    return token;
}

function validateToken(token){
    return JWS.verify(token,secret);
}


module.exports = {
    createTokenForUser,
    validateToken,
}