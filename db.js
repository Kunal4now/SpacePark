const mongoose = require('mongoose')

const URI = 'mongodb+srv://kunal:Idbrs078%40@cluster0.o8b6a.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(URI).then((result) => console.log('connedted to db'));

module.exports = exports = mongoose;