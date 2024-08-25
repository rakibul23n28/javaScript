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
    const { blogID, duration } = req.body;
    try {

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let timeSpent = await TimeSpent.findOne({ blogID });

        if (!timeSpent) {
            // If no entry exists, create a new one
            timeSpent = new TimeSpent({
                blogID,
                timeSpent: [{ day: today, duration }],
                totalDuration: duration,
            });
        } else {

            const dayEntry = timeSpent.timeSpent.find(entry => entry.day.getTime() === today.getTime());

            if (dayEntry) {
                dayEntry.duration += duration;
            } else {

                timeSpent.timeSpent.push({ day: today, duration });
            }

            timeSpent.totalDuration += duration;
        }

        await timeSpent.save();
        return res.status(200).json({ message: 'Time spent recorded successfully' });
    }catch (err) {
        return res.status(500).json({ error: err.message });
    }
    
});

  
router.get('/activity/last7days/:blogID', async (req, res) => {
    const { blogID } = req.params;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight

        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7); // Get the date 7 days ago

        // Find the time spent entries for the blogID in the last 7 days
        const timeSpentEntries = await TimeSpent.findOne({
            blogID,
            "timeSpent.day": { $gte: sevenDaysAgo }
        });

        if (!timeSpentEntries) {
            return res.status(200).json({ totalDuration: 0, entries: [] }); // Return 0 duration and empty entries
        }

        // Filter out only the entries from the last 7 days
        const last7DaysData = timeSpentEntries.timeSpent.filter(entry => entry.day >= sevenDaysAgo);

        // Calculate the total duration for the last 7 days
        const totalDuration = last7DaysData.reduce((total, entry) => total + entry.duration, 0);

        return res.status(200).json({ totalDuration, entries: last7DaysData });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});



module.exports = router