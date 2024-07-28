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
            console.log("llll");
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

module.exports = {
    checkForAuthentication,
    redirectIfAuthenticate
}