const {Router} = require('express');
const {restrictTo} = require('../middlewares/auth');
const {handleAllUrls,handleAllUsers,handleDeleteUsers,handleDeleteUrls} = require('../controllers/admin');

const router = Router();
router.use(restrictTo('ADMIN'));
router.get('/urls', handleAllUrls);
router.get('/users', handleAllUsers);
router.get('/user/delete/:id', handleDeleteUsers);
router.get('/url/delete/:shortId', handleDeleteUrls);
module.exports = router