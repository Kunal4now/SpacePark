const db = require('../db')
const { ServerDescription } = require('mongoose/node_modules/mongodb')

const postSchema = new db.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = db.model('Post', postSchema);