const Tag = require('../models/tag');
const User = require('../models/user');
const Comment = require('../models/comment');
const Like = require('../models/like');
const TimeSpent = require('../models/timeSpent');
const Blog = require('../models/blog')

function adminTags(req, res) {
    Tag.find({})
        .then((tags) => {
            res.render('adminTags', {
                title: 'Tags',
                tags: tags,
                user: req.user
            });
        })
        .catch((err) => {
            console.error('Error fetching tags:', err);
            res.status(500).json({ error: 'Failed to fetch tags' });
        });
}

async function handleAdminTags(req, res) {
    try {
        const { name } = req.body;

        // Split the tags by commas, trim whitespace, and filter out empty strings
        const tags = name.split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);

        for (let i = 0; i < tags.length; i++) {
            const element = tags[i];

            // Check if the tag already exists
            const tagExists = await Tag.findOne({ name: element });
            if (tagExists) continue;

            // Create the new tag
            await Tag.create({ name: element });
        }

        res.redirect('/admin/tags');
    } catch (err) {
        console.error('Error handling admin tags:', err);
        res.status(500).json({ error: 'Failed to create tags' });
    }
}

async function adminUsers(req, res) {
    try {
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'blogs',
                    localField: '_id',
                    foreignField: 'createdBy',
                    as: 'blogs'
                }
            },
            {
                $addFields: {
                    blogCount: { $size: '$blogs' }
                }
            }
        ]);

        res.render('adminUsers', {
            title: "Admin User",
            user: req.user,
            users
        });
    } catch (err) {
        console.error('Error rendering users:', err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

async function handleDeleteUser (req, res){
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        let me = false;
        if(user.role === 'admin'){

            if(user._id.toString() === req.user._id){
                me = true;
            }
            else{
                return res.redirect('/admin/users');
            }
        }

        if (!user) {
            return res.status(404).send('User not found');
        }
        await User.findByIdAndDelete(user._id);
        await Comment.deleteMany({ createdBy: user._id });

        await Like.deleteMany({ createdBy: user._id });
        await TimeSpent.deleteMany({ createdBy: user._id });
        await Blog.deleteMany({ createdBy: user._id });

        if(me){
            res.clearCookie('token').redirect('/');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}
async function handleUserToAdmin (req, res) {
    try {
        const { email } = req.body;
        await User.findOneAndUpdate({ email }, { role: 'admin' });
        res.redirect('/admin/users'); // Redirect back to the users page
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

module.exports = {
    adminTags,
    handleAdminTags,
    adminUsers,
    handleDeleteUser,
    handleUserToAdmin
};
