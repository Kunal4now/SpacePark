const session = require('express-session')
const connectRedis = require('connect-redis')
const redis = require('ioredis')

const redisClient = new redis({
    PORT: 4000
})

const RedisStore = connectRedis(session)

module.exports = session({
    store: new RedisStore({client: redisClient}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    }
})
