const {Router} = require('express');
const Tag = require('../models/tag');


const router = Router();

router.get('/tags',(req,res)=>{
    Tag.find({}).then((tags)=>{
        res.render('adminTags', {
            title: 'Tags',
            tags: tags,
            user: req.user
        });
    })
})

router.post('/tags', async (req, res) => {
    try {
      const { name } = req.body;
      
      // Split the tags by commas, trim whitespace, and filter out empty strings
      const tags = name.split(',')
                       .map(tag => tag.trim())
                       .filter(tag => tag.length > 0);
  
      for (let i = 0; i < tags.length; i++) {
        const element = tags[i];
        
        // Check if the tag already exists for the current user
        const tagExists = await Tag.findOne({ name: element });
        if (tagExists) continue;
  
        // Create the new tag
        await Tag.create({ name: element });
      }
  
      res.redirect('/admin/tags');
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: 'Failed to create tags' });
    }
  });
  



module.exports = router
