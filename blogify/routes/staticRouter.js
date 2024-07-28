const {Router} = require('express');
const {redirectIfAuthenticate} = require('../middlewares/authentication')
const router = Router();

router.get("/", (req, res) => {
    res.render("index",{ 
      title: 'Share Your Secret HAHA',
      user: req.user
     });
  });
router.get('/signup', redirectIfAuthenticate, (req, res) => {
res.render('signup',{ title: 'Sign Up' });
});

router.get('/login',redirectIfAuthenticate, (req, res) => {
res.render('login',{ 
    title: 'Login',
    });
});

module.exports = router;