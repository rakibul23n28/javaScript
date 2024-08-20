const {Router} = require('express');
const router = Router();
const upload = require('../middlewares/multer');
const path = require('path');
const fs = require('fs');
const Blog = require('../models/blog');
const TimeSpent = require("../models/timeSpent");
const Like = require("../models/like");

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
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        }).populate('createdBy').exec();
        const blogsWithLikes = await Promise.all(blogs.map(async (blog) => {
            const likeCount = await Like.countDocuments({ blogID: blog._id });
            return {
                ...blog.toObject(),
                likeCount
            };
        }));
        blogsWithLikes.sort((a, b) => b.likeCount - a.likeCount);
        res.json(blogsWithLikes);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
  });


  router.post('/time-spent', async (req, res) => {
    try {
        const { timeSpent, blogID, userID } = req.body;
        
        if (!userID) {
            return res.status(200).json({ message: 'Time spent recorded without user ID' });
        }
        
        // Find existing time spent entry for this blog and user
        const findTimeSpent = await TimeSpent.findOne({ blogID: blogID, createdBy: userID });
        if (findTimeSpent) {
            // Update the existing entry
            findTimeSpent.timeSpent += timeSpent;
            await findTimeSpent.save();
            return res.status(200).json({ message: 'Time spent recorded successfully' }); // Add return here
        }

        // If no existing entry, create a new one
        const timeSpentEntry = new TimeSpent({ blogID: blogID, createdBy: userID, timeSpent: timeSpent });
        await timeSpentEntry.save();
        return res.status(200).json({ message: 'Time spent recorded successfully' }); // Add return here

    } catch (err) {
        // Handle any errors
        return res.status(500).json({ error: err.message });
    }
});

  
  module.exports = router;

module.exports = router