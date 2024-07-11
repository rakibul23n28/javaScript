const {Router} = require('express');
const {restrictTo} = require('../middlewares/auth');
const {handleAllUrls,handleAllUsers,handleDeleteUsers} = require('../controllers/admin');

const router = Router();
router.use(restrictTo('ADMIN'));
router.get('/urls', handleAllUrls);
router.get('/users', handleAllUsers);
router.get('/user/delete/:id', handleDeleteUsers);
module.exports = router