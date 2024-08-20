const {Schema,model} = require('mongoose');

const tagScama= new Schema({
    name:{
        type: String,
        required: true
    }
},{timestamps: true});

module.exports = model('tag', tagScama);