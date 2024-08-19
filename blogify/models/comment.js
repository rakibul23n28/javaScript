const {Schema,model} = require('mongoose');

const commentScama= new Schema({
    comment:{
        type: String,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    blogID:{
        type: Schema.Types.ObjectId,
        ref: 'blog'
    },
    isSpam:{
        type: Number,
        default: 0
    }

},{timestamps: true});

module.exports = model('comment', commentScama);