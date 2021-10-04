const db = require('../db')

const postSchema = new db.Schema({
    userID: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
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