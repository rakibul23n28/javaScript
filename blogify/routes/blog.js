const multer  = require('multer');
const path = require('path');
const {Router} = require('express');
const {blogAddNew,handleNewAddedBlog,BlogRenderByID,postCommentSave} = require('../controllers/blog')
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

const upload = multer({ storage: storage })

const router = Router();
router.get('/add-new',checkAuthenticate,blogAddNew);
router.post('/add-new',upload.single('coverImage'),handleNewAddedBlog);
router.get('/:blogID',BlogRenderByID);
router.post('/comment/:blogID',postCommentSave);




module.exports = router;