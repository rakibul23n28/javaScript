const {Router} = require('express');
const router = Router();
const upload = require('../middlewares/multer');
const path = require('path');
const fs = require('fs');
const Blog = require('../models/blog');

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
  // Route for searching blogs
router.get('/search', async (req, res) => {
    console.log(req.query.q);
    
    const query = req.query.q || '';
    try {
        const blogs = await Blog.find({
            title: { $regex: query, $options: 'i' }
        }).populate('createdBy').exec();
        res.json(blogs);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
  });

module.exports = router