const redisClient = require("../../redis");
const {parseFriendList} = require("./parsedFriendList");
module.exports.initializeUser = async (socket) => {
    socket.user = {...socket.request.session.user}
    socket.join(socket.user.userid)
    await redisClient.hset(
        `userid:${socket.user.username}`,
        "userid",
        socket.user.userid,
        "connected",
        true
    )
    const friendList = await redisClient.lrange(
        `friends:${socket.user.username}`,
        0,
        -1
    );
    const parsedFriendList = await parseFriendList(friendList)
    const friendRooms = parsedFriendList.map(friend => friend.userid)

    if (friendRooms.length > 0)
        socket.to(friendRooms).emit("connected", true, socket.user.username);

    console.log(`${socket.user.username} friends:`, parsedFriendList);

    socket.emit("friends", parsedFriendList);

    console.log('UID: ', socket.user.userid)
    console.log('SOCKET ID: ', socket.id)
    console.log(socket.request.session.user.username)

    const msgQuery = await redisClient.lrange(
        `chat:${socket.user.userid}`,
        0,
        -1
    )
    const messages = msgQuery.map(msgStr => {
        const parsedStr = msgStr.split(".")
        return {
            to: parsedStr[0],
            from: parsedStr[1],
            content: parsedStr[2]
        }
    })
    if (messages && messages.length > 0) {
        socket.emit("messages", messages)

    }

}