const {Schema,model} = require('mongoose');

const timeSpentScama= new Schema({
    timeSpent: [{
        day: {
          type: Date,
          required: true,
        },
        duration: {
          type: Number,
          required: true,
          default: 0,
        }
    }],
    totalDuration: {
        type: Number,
        required: true,
        default: 0,
    },
    blogID:{
        type: Schema.Types.ObjectId,
        ref: 'blog'
    }
},{timestamps: true});

module.exports = model('timeSpent', timeSpentScama);