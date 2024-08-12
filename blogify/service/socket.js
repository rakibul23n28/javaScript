const Comment = require('../models/comment');

module.exports = function(server){
    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
        // Listen for a new comment
        socket.on('newComment', async (data) => {
            try {
                // Create and save a new comment
                const newComment = new Comment({
                    comment: data.comment,
                    createdBy: data.createdBy,
                    blogID: data.blogID
                });

                const savedComment = await newComment.save();
                
                // Populate the 'createdBy' field
                const comment = await Comment.findById(savedComment._id).populate('createdBy').exec();

                // Emit the comment to all connected clients
                io.emit('commentAdded', comment);
            } catch (error) {
                console.error('Error saving comment:', error);
                socket.emit('error', { message: 'Failed to save comment' });
            }
        });

        // Listen for a delete comment request
        socket.on('deleteComment', async (commentID) => {
            try {
                // Find and delete the comment
                const deletedComment = await Comment.findByIdAndDelete(commentID);

                if (deletedComment) {
                    // Notify all connected clients about the deleted comment
                    io.emit('commentDeleted', deletedComment._id);
                } else {
                    socket.emit('error', { message: 'Comment not found' });
                }
            } catch (error) {
                console.error('Error deleting comment:', error);
                socket.emit('error', { message: 'Failed to delete comment' });
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
}