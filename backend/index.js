const express = require('express');
const {Server} = require("socket.io");
const app = express();
const helmet = require("helmet");
const cors = require('cors');
require('ioredis');
require('express-session');
const authRouter = require("./routers/authRouter");
require("connect-redis").default;
require('./redis');
const {sessionMiddleware, wrap, corsConfig} = require("./controllers/serverController");
const {authorizeUser, addFriend, initializeUser, onDisconnect} = require("./controllers/socketController/socketController");
const {dm} = require("./db/dm");
require('dotenv').config();

const server = require("http").createServer(app);
const io = new Server(server, {
    cors: corsConfig
})

app.use(helmet())
app.use(cors(corsConfig))
app.use(express.json())
app.use(sessionMiddleware)
app.use("/auth", authRouter)

io.use(wrap(sessionMiddleware))
io.use(authorizeUser)
io.on("connect", socket => {
    initializeUser(socket)
    socket.on("add_friend", (friendName, cb) => {
        addFriend(socket, friendName, cb)
    })

    socket.on("dm", (message) => dm(socket, message))

    socket.on("disconnecting", () => onDisconnect(socket))
})

server.listen(4000, () => {
    console.log("Server listening on port 4000")
})