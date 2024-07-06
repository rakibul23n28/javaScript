const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unicke: true
    },
    role: {
        type: String,
        required: true,
        default:"NORMAL"
    }

},{timestamps: true});

module.exports = mongoose.model("user",userSchema)