const {Router} = require('express');
const Tag = require('../models/tag');

const {adminTags,handleAdminTags,adminUsers,handleDeleteUser,handleUserToAdmin} = require('../controllers/admin');


const router = Router();

router.get('/tags',adminTags)

router.post('/tags', handleAdminTags);

router.get('/users',adminUsers);

router.post('/delete-user', handleDeleteUser);

router.post('/promote-user',handleUserToAdmin );
  



module.exports = router
