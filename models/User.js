var mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: String
});

const user = mongoose.model('user', userSchema);
module.exports = user;