require('dotenv').config()
var express = require('express');
const morgan = require('morgan');
var path = require('path');
var app = express();
const db = require('./db')
const initializePassport = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
var session = require('express-session')
const methodOverride = require('method-override')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: { path: '/', httpOnly: true, maxAge: 365 * 60 * 60 * 1000}, 
  saveUninitialized: false
}))


var index = require('./routes/index') 
var authRoute = require('./routes/auth')
var userRoute = require('./routes/users')
var inedxRoute = require('./routes/index')
const { error } = require('console');

const hostname = process.env.HOST;
const port = process.env.PORT;

app.set('view engine', 'ejs')

// It basically tells our express app to use the public folder in the app
app.use('/public', express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))

//Middleware for authentication
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(morgan('dev'));

//initializing the passport functionality
initializePassport(passport)

app.use('/', authRoute)

app.use('/', inedxRoute)
// app.get('/', checkNotAuthenticated, (req, res) =>{
//   res.render('home-guest')
// })

// app.get('/profile', checkAuthenticated ,(req, res) => {
//   res.render('profile')
// })

// app.get('/404', (req, res) => {
//   res.render('404')
// })

// app.get('/profile-new/:id', checkAuthenticated, (req, res) => {
//   if (req.user.id === req.params.id) {
//     res.render('profile-new')
//   } else {
//     return res.status(400).send({
//       message: 'This is an error!'
//    });
//   }
// })

// app.get('/create-post', checkAuthenticated, (req, res) => {
//   res.render('create-post', {id: req.user.id})
// })

// app.get('/home-dashboard', checkAuthenticated, (req, res) => {
//   const blogs = [
//     {title: 'Yoshi finds eggs', snippet: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, earum facilis. Porro soluta et quas odio magnam ipsum! Ipsam, veritatis ab tempore commodi minima tenetur quasi illo quam nemo delectus quo nam beatae repudiandae assumenda consectetur veniam quidem voluptates et aperiam debitis vitae unde. Iusto natus quod minima voluptates eaque.'},
//     {title: 'Mario finds stars', snippet: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, earum facilis. Porro soluta et quas odio magnam ipsum! Ipsam, veritatis ab tempore commodi minima tenetur quasi illo quam nemo delectus quo nam beatae repudiandae assumenda consectetur veniam quidem voluptates et aperiam debitis vitae unde. Iusto natus quod minima voluptates eaque.'},
//     {title: 'How to defeate bowser', snippet: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nesciunt, earum facilis. Porro soluta et quas odio magnam ipsum! Ipsam, veritatis ab tempore commodi minima tenetur quasi illo quam nemo delectus quo nam beatae repudiandae assumenda consectetur veniam quidem voluptates et aperiam debitis vitae unde. Iusto natus quod minima voluptates eaque.'}
//   ]
//   res.render('home-dashboard', {blogs, id: req.user.id})
// })  

app.use('/profile-new/', userRoute)

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/home-dashboard')
  }
  next()
}

app.listen(port)
    console.log(`listening on port http://${hostname}:${port}/`)