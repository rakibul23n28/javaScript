const {Schema,model} = require('mongoose');

const timeSpentScama= new Schema({
    timeSpent:{
        type: Number,
        required: true
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    blogID:{
        type: Schema.Types.ObjectId,
        ref: 'blog'
    }
},{timestamps: true});

module.exports = model('timeSpent', timeSpentScama);