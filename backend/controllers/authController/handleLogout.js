module.exports.handleLogout = (req, res, next) => {
    console.log('logout called')
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                console.log("logout successfull")
                res.send('Logout successful')
            }
        });
        // req.session.user = null;
        // req.session.save(function (err) {
        //     if (err) next(err)
        // })
    } else {
        res.end();
    }
}