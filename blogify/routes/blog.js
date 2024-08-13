const multer  = require('multer');
const path = require('path');
const {Router} = require('express');
const fs = require('fs');

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
    const filename = Date.now() + path.extname(file.originalname);
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

// Image upload route
router.post('/upload/image', upload.single('file'), (req, res) => {
  if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`; 
      // Store uploaded image URL in session (or database)
      if (!req.session?.uploadedImages) {
          req.session.uploadedImages = [];
      }
      req.session.uploadedImages.push(imageUrl);


      // Return the URL of the uploaded image
      res.json({ url: imageUrl });
  } else {
      res.status(400).json({ error: 'Image upload failed' });
  }
});

// Cleanup route (optional, called on form close or page unload)
router.post('/cleanup', (req, res) => {
          
  if (req.session.uploadedImages) {
      req.session.uploadedImages.forEach(imageUrl => {
          const filePath = path.join(__dirname, '../public', imageUrl);
          
          fs.unlink(filePath, err => {
              if (err) console.error(`Failed to delete image: ${filePath}`, err);
          });
      });
      req.session.uploadedImages = null;
  }
  res.sendStatus(200);
});

router.get('/add-new',checkAuthenticate,blogAddNew);
router.post('/add-new',upload.single('coverImage'),handleNewAddedBlog);
router.get('/:blogID',BlogRenderByID);
// router.post('/comment/:blogID',checkAuthenticate,postCommentSave);

router.get('/edit/:blogID',EditBlog);
router.post('/edit/:blogID',upload.single('coverImage'),handleEditBlog);
router.get('/delete/:blogID',handleDeleteBlog);



module.exports = router;