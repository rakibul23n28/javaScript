const multer  = require('multer');
const path = require('path');
const {Router} = require('express');
const {blogAddNew,handleNewAddedBlog,BlogRenderByID} = require('../controllers/blog')

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
router.get('/add-new',blogAddNew);
router.post('/add',upload.single('coverImage'),handleNewAddedBlog);
router.get('/:blogID',BlogRenderByID);



module.exports = router;