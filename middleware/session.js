const session = require('express-session')
const connectRedis = require('connect-redis')
const redis = require('ioredis')

const redisClient = new redis({
    port: process.env.REDIS_PORT, // Redis port
    host: process.env.REDIS_HOST, // Redis host
    username: process.env.REDIS_USERNAME, // needs Redis >= 6
    password: process.env.REDIS_PASS,
    db: 0, // Defaults to 0,
  })

const RedisStore = connectRedis(session)

module.exports = session({
    store: new RedisStore({client: redisClient}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
})
