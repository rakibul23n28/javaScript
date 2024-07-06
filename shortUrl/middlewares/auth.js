const{getUser} = require('../service/auth');

function checkForAuthentication(req,res,next){
    const userUid = req.cookies?.uid;
    if(!userUid) {
        return next();
    }else{
        const user = getUser(userUid);
        if(!user) {
            return res.redirect('/login');
        }
        req.user = user;
        next();
    }
}

function restrictTo(roles = []){
    return function(req,res,next){
        if(!req.user) return res.redirect('/login');
        if(!roles.includes(req.user.role)){
            return res.end('UnAuthorized');
        }
        return next()
    };
}

module.exports = {checkForAuthentication, restrictTo}