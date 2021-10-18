var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        data: Buffer,
        contentType: String
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;