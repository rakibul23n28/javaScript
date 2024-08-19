const Comment = require('../models/comment');
const Like = require('../models/like');
const { RateLimiterMemory, RateLimiterRes } = require('rate-limiter-flexible');

// Configure rate limiters
const commentRateLimiter = new RateLimiterMemory({
  points: 5, // Number of points
  duration: 60, // Per 60 seconds
});

const spamRateLimiter = new RateLimiterMemory({
  points: 10, // Number of points
  duration: 60, // Per 60 seconds
});

const likeRateLimiter = new RateLimiterMemory({
  points: 10, // Number of points
  duration: 60, // Per 60 seconds
});

module.exports = function (server) {
  const io = require('socket.io')(server);

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle new comment with rate limiting
    socket.on('newComment', async (data) => {
      try {
        await commentRateLimiter.consume(socket.id); // Rate limit check

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
        if (error instanceof RateLimiterRes) {
          socket.emit('error', { message: 'Rate limit 5 comments per minute. Rate limit exceeded. Please wait 1 minute before commenting again.' });
        } else {
          console.error('Error saving comment:', error);
          socket.emit('error', { message: 'Failed to save comment' });
        }
      }
    });

    // Handle delete comment with rate limiting
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

    // Handle marking comments as spam
    socket.on('markToSpam', async (commentID) => {
      try {
        await spamRateLimiter.consume(socket.id); // Rate limit check
        const comment = await Comment.findById(commentID);
        if (comment) {
          comment.isSpam = comment.isSpam + 1;
          await comment.save();
          socket.emit('commentMarkedAsSpam', commentID);
        } else {
          socket.emit('error', { message: 'Comment not found' });
        }
      } catch (error) {
        if(error instanceof RateLimiterRes){
            socket.emit('error', { message: 'Rate limit 10 spam per minute. Rate limit exceeded. Please wait 1 minute before spaming again.' });
        }else{

            console.error('Error marking comment as spam:', error);
            socket.emit('error', { message: 'Failed to mark comment as spam' });
        }
      }
    });

    // Handle unmarking comments as spam
    socket.on('unmarkToSpam', async (commentID) => {
      try {
        const comment = await Comment.findById(commentID);
        if (comment) {
            comment.isSpam = comment.isSpam - 1;
          await comment.save();
          socket.emit('commentUnmarkedAsSpam', commentID);
        } else {
          socket.emit('error', { message: 'Comment not found' });
        }
      } catch (error) {
        console.error('Error unmarking comment as spam:', error);
        socket.emit('error', { message: 'Failed to unmark comment as spam' });
      }
    });

    // Handle like with rate limiting
    socket.on('like', async ({ blogID, userID }) => {
      try {
        await likeRateLimiter.consume(socket.id); // Rate limit check

        // User has not liked, so add a like
        const newLike = new Like({ blogID: blogID, createdBy: userID });
        await newLike.save();
        const total = await Like.countDocuments({ blogID: blogID });
        socket.emit('liked');

        io.emit('updateLike', total);
      } catch (err) {
        if (err instanceof RateLimiterRes) {
          socket.emit('error', { message: 'Rate limit 10 likes per minute. Rate limit exceeded. Please wait 1 minute before liking again.' });
        } else {
          console.error('Error handling like:', err);
        }
      }
    });

    // Handle dislike with rate limiting
    socket.on('dislike', async ({ blogID, userID }) => {
      try {
        // Check if the user has already liked the blog
        const existingLike = await Like.findOne({ blogID: blogID, createdBy: userID });
        if (existingLike) {
          await Like.deleteOne({ _id: existingLike._id });
          const total = await Like.countDocuments({ blogID: blogID });
          socket.emit('disliked');

          io.emit('updateLike', total);
        } else {
          socket.emit('error', { message: 'Like not found' });
        }
      } catch (err) {
          console.error('Error handling dislike:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
