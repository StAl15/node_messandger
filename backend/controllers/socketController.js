const redisClient = require('../redis')

module.exports.authorizeUser = (socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
        console.log("Bad request")
        next(new Error("Not authorized"))
    } else {
        next()
    }
}

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


module.exports.addFriend = async (socket, friendName, cb) => {
    console.log(friendName)
    if (friendName === socket.user.username) {
        console.log("cannot add self")
        cb({done: false, errorMsg: "Cannot add self"});
        return;
    }
    const friend = await redisClient.hgetall(
        `userid:${friendName}`
    )
    console.log('FUID: ', friend.userid)

    const currentFriendList = await redisClient.lrange(
        `friends:${socket.user.username}`,
        0,
        -1
    )
    if (!friend.userid) {
        cb({done: false, errorMsg: "User doesn't exist"});
        return;
    }
    if (currentFriendList && currentFriendList.indexOf(`${friendName}.${friend.userid}`) !== -1) {
        cb({done: false, errorMsg: "Friend already aded"});
        return;
    }

    await redisClient.lpush(
        `friends:${socket.user.username}`,
        [friendName, friend.userid,].join("."));

    const newFriend = {
        username: friendName,
        userid: friend.userid,
        connected: friend.connected
    }
    cb({done: true, newFriend});

}


module.exports.onDisconnect = async (socket) => {
    await redisClient.hset(
        `userid:${socket.user.username}`,
        "connected",
        false
    )
    const friendList = await redisClient.lrange(
        `friends:${socket.user.username}`,
        0,
        -1)
    const friendRooms = await parseFriendList(friendList).then(friends =>
        friends.map(friend => friend.userid)
    )
    socket.to(friendRooms).emit("connected", false, socket.user.username);
    //get friends
    //emit all friends that offline now
}

const parseFriendList = async (friendList) => {
    const newFriendList = [];
    for (let friend of friendList) {
        const parsedFriend = friend.split('.')
        const friendConnected = await redisClient.hget(
            `userid:${parsedFriend[0]}`,
            "connected"
        )
        newFriendList.push({
            username: parsedFriend[0],
            userid: parsedFriend[1],
            connected: friendConnected,
        })
    }
    return newFriendList
}