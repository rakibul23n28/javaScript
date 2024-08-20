const { validateToken} = require('../service/authentication');

function checkForAuthentication(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];
        if(!tokenCookieValue) {
            return next();
        }
        try{
            const payload = validateToken(tokenCookieValue);
            req.user = payload;
        }
        catch(err){
        }
        return next();

    };
}

function redirectIfAuthenticate(req,res,next){
    if(req.user){
        return res.redirect('/');
    }
    return next();
}

function checkAuthenticate(req,res,next){
    if(req.user){
       return next()
    }else{
        return res.redirect('/login')
    }
}
function restrictTo(roles = []){
    return function(req,res,next){

        if(!roles.includes(req.user.role)){
            return res.end('UnAuthorized');
        }
        return next();
    }
}
module.exports = {
    checkForAuthentication,
    redirectIfAuthenticate,
    checkAuthenticate,
    restrictTo
}