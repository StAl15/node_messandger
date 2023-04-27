const {sessionMiddleware} = require("../serverController");
module.exports.handleLogin = (req, res) => {
    console.log('ran heavy task with session: ', req.session)
    if (req.session.user && req.session.user.username) {
        console.log('logged in')
        res.json({loggedIn: true, username: req.session.user.username})
    } else {
        res.json({loggedIn: false})
    }
}