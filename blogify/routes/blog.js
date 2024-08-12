const multer  = require('multer');
const path = require('path');
const {Router} = require('express');
const {
  blogAddNew,
  handleNewAddedBlog,
  BlogRenderByID,
  // postCommentSave,
  EditBlog,
  handleEditBlog,
  handleDeleteBlog,
} = require('../controllers/blog')
const {checkAuthenticate} = require('../middlewares/authentication');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`))
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
})

// Configure Multer with limits and file filter
const upload = multer({
  storage: storage,
  limits: {
      fieldSize: 10 * 1024 * 1024, 
      fileSize: 10 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
      const fileTypes = /jpeg|jpg|png|gif/;
      const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = fileTypes.test(file.mimetype);

      if (mimetype && extname) {
          return cb(null, true);
      } else {
          cb(new Error('Only images are allowed!'));
      }
  }
});
const router = Router();

router.get('/add-new',checkAuthenticate,blogAddNew);
router.post('/add-new',upload.single('coverImage'),handleNewAddedBlog);
router.get('/:blogID',BlogRenderByID);
// router.post('/comment/:blogID',checkAuthenticate,postCommentSave);

router.get('/edit/:blogID',EditBlog);
router.post('/edit/:blogID',upload.single('coverImage'),handleEditBlog);
router.get('/delete/:blogID',handleDeleteBlog);



module.exports = router;