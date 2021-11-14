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

var authRoute = require('./routes/auth')
var userRoute = require('./routes/users')
var inedxRoute = require('./routes/index')
var postRoute = require('./routes/posts');
var followRoute = require('./routes/follow')
const cookieParser = require('cookie-parser');

const hostname = process.env.HOST;
const port = process.env.PORT;

app.set('view engine', 'ejs')

// It basically tells our express app to use the public folder in the app
// app.use('/public', express.static('public'))
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}))

//Middleware for authentication
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(morgan('dev'));
// app.use(cookieParser(process.env.SESSION_SECRET))

//initializing the passport functionality
initializePassport(passport)

app.use((req, res, next) => {
  res.locals.message = req.session.message
  delete req.session.message
  next()
})

app.use('/', authRoute)
app.use('/', inedxRoute)
app.use('/profile-new', userRoute)
app.use('/posts', postRoute)
app.use('/home-dashboard', followRoute)


app.listen(port)
    console.log(`listening on port http://${hostname}:${port}/`)