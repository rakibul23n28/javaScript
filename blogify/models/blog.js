const { Schema, model } = require('mongoose');

const fieldSchema = new Schema({
    key: { type: String, required: true },
    value: { type: String, required: true },
}, { _id: false }); // Disable _id for subdocuments

const blogSchema = new Schema({
    fields: [fieldSchema],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',  // Ensure this matches the correct model name for User
        required: true
    }
}, { timestamps: true });

module.exports = model('Blog', blogSchema);
