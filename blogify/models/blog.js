const {Schema,model} = require('mongoose');

const blogScama= new Schema({
    title:{
        type: String,
        required: true
    },
    body :{
        type: String,
        required: true
    },
    coverImageURL:{
        type: String,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
},{timestamps: true});

module.exports = model('blog', blogScama);