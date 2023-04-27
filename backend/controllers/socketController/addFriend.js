const redisClient = require("../../redis");
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