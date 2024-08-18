const {Schema,model} = require('mongoose');

const likeScama= new Schema({
    blogID:{
        type: Schema.Types.ObjectId,
        ref: 'blog'
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
},{timestamps: true});

module.exports = model('like', likeScama);