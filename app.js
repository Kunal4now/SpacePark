var express = require('express');
var path = require('path');

var app = express();

app.set('view engine', 'ejs')

//It basically tells our express app to use the public folder in the app
app.use('/public', express.static('public'))

app.get('/', (req, res) =>{
  res.render('home-guest')
})

app.get('/profile', (req, res) => {
  res.render('profile')
})

app.get('/404', (req, res) => {
  res.render('404')
})

app.get('/profile-new', (req, res) => {
  res.render('profile-new')
})

app.listen(3000)
    console.log('listening on port http://localhost:3000/')