const {Router} = require('express');
const router = Router();
const {handleLogin,handleLogout,handleSignUp} = require('../controllers/authentication');

router.post('/signup',handleSignUp);
router.post('/login',handleLogin);
router.get('/logout',handleLogout);


  module.exports = router;