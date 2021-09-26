const mongoose = require('mongoose')

const URI = process.env.URI;

mongoose.connect(URI).then((result) => console.log('connedted to db'));

module.exports = exports = mongoose;