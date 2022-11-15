require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const app = express();
const initializePassport = require('./passport-config')
const passport = require('passport')
const flash = require('express-flash')
const session = require('./middleware/session')
const methodOverride = require('method-override')

app.use(session)

const authRoute = require('./routes/auth')
const userRoute = require('./routes/users')
const inedxRoute = require('./routes/index')
const postRoute = require('./routes/posts');
const followRoute = require('./routes/follow')

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

app.get("*", (req, res) => {
  res.render('404')
})


app.listen(port, () => {
  console.log(`listening on port http://${hostname}:${port}/`)
})