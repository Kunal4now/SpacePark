var express = require('express');
const morgan = require('morgan');
var path = require('path');
var app = express();

require('dotenv').config()
const db = require('./db')
var index = require('./routes/index') 
var users = require('./routes/users')

const hostname = process.env.HOST;
const port = process.env.PORT;

//setting the view engine to ejs
app.set('view engine', 'ejs')

//It basically tells our express app to use the public folder in the app
app.use('/public', express.static('public'))
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));

app.use('/', index);

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

app.get('/create-post', (req, res) => {
  res.render('create-post')
})

app.get('/home-dashboard', (req, res) => {
  const blogs = [
    {title: 'Yoshi finds eggs', snippet: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, earum facilis. Porro soluta et quas odio magnam ipsum! Ipsam, veritatis ab tempore commodi minima tenetur quasi illo quam nemo delectus quo nam beatae repudiandae assumenda consectetur veniam quidem voluptates et aperiam debitis vitae unde. Iusto natus quod minima voluptates eaque.'},
    {title: 'Mario finds stars', snippet: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, earum facilis. Porro soluta et quas odio magnam ipsum! Ipsam, veritatis ab tempore commodi minima tenetur quasi illo quam nemo delectus quo nam beatae repudiandae assumenda consectetur veniam quidem voluptates et aperiam debitis vitae unde. Iusto natus quod minima voluptates eaque.'},
    {title: 'How to defeate bowser', snippet: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, earum facilis. Porro soluta et quas odio magnam ipsum! Ipsam, veritatis ab tempore commodi minima tenetur quasi illo quam nemo delectus quo nam beatae repudiandae assumenda consectetur veniam quidem voluptates et aperiam debitis vitae unde. Iusto natus quod minima voluptates eaque.'}
  ]

  res.render('home-dashboard', {blogs})
})

app.use(users)

app.listen(port)
    console.log(`listening on port http://${hostname}:${port}/`)