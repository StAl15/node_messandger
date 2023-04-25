require('dotenv').config();
const session = require("express-session");
const {default: RedisStore} = require("connect-redis");
const redisClient = require("../redis");

const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: 'sid',
    resave: false,
    store: new RedisStore({client: redisClient}),
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production" ? "true" : 'auto',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : 'lax',
        expires: 1000 * 60 * 60 * 24 * 7,
    }
})

const wrap = (expressMiddleware) => (socket, next) => expressMiddleware(socket.request, {}, next)

const corsConfig = {
    origin: "http://localhost:3000",
    credentials: true,
}

module.exports = {sessionMiddleware, wrap, corsConfig}