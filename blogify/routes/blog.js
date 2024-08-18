const multer  = require('multer');
const path = require('path');
const {Router} = require('express');
const fs = require('fs');
const upload = require('../middlewares/multer');

const {
  blogAddNew,
  handleNewAddedBlog,
  BlogRenderByID,
  // postCommentSave,
  EditBlog,
  handleEditBlog,
  handleDeleteBlog,
  renderOwnBlogs
} = require('../controllers/blog')
const {checkAuthenticate} = require('../middlewares/authentication');

const router = Router();

router.get('/my-blogs',checkAuthenticate,renderOwnBlogs);
router.get('/add-new',checkAuthenticate,blogAddNew);
router.post('/add-new',upload.single('coverImage'),handleNewAddedBlog);
router.get('/:blogID',BlogRenderByID);
// router.post('/comment/:blogID',checkAuthenticate,postCommentSave);

router.get('/edit/:blogID',EditBlog);
router.post('/edit/:blogID',upload.single('coverImage'),handleEditBlog);
router.get('/delete/:blogID',handleDeleteBlog);



module.exports = router;