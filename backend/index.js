const express = require('express');
const {Server} = require("socket.io")
const app = express()
const helmet = require("helmet")
const cors = require('cors')
const session = require('express-session')
const authRouter = require("./routers/authRouter")
require('dotenv').config()

const server = require("http").createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: "true",
    }
})

app.use(helmet())
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}))
app.use(express.json())
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        credentials: true,
        name: 'sid',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.ENVIRONMENT === "production" ? "true" : 'auto',
            httpOnly: true,
            sameSite: process.env.ENVIRONMENT === "production" ? "none" : 'lax',

        }
    }))
app.use("/auth", authRouter)

app.get('/', (req, res) => {
        res.json("world")
    }
)

io.on("connect", socket => {
})

server.listen(4000, () => {
    console.log("Server listening on port 4000")
})