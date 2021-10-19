const { Schema } = require('mongoose');
const db = require('../db')

const postSchema = new db.Schema({
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    snippet: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
}, {timestamps: true})

module.exports = db.model('Post', postSchema);