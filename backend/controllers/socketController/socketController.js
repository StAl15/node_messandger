const redisClient = require('../../redis')
const {onDisconnect} = require("./onDisconnect");
const {initializeUser} = require("./initializeUser");
const {authorizeUser} = require("./authorizeUser");
const {addFriend} = require("./addFriend");
const {parseFriendList} = require("./parsedFriendList");

module.exports = {
    parseFriendList,
    addFriend,
    authorizeUser,
    initializeUser,
    onDisconnect
}