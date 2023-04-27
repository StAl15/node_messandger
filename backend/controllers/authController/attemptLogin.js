const pool = require("../../db/db");
const bcrypt = require("bcrypt");
module.exports.attemptLogin = async (req, res) => {
    console.log(req.session)
    const potentialLogin = await pool.query(
        "SELECT id, username, passhash, userid FROM users u WHERE u.username=$1",
        [req.body.username]
    )

    if (potentialLogin.rowCount > 0) {
        const isSamePass = await bcrypt.compare(
            req.body.password,
            potentialLogin.rows[0].passhash
        )
        if (isSamePass) {
            req.session.user = {
                username: req.body.username,
                id: potentialLogin.rows[0].id,
                userid: potentialLogin.rows[0].userid

            }
            console.log('success login ', req.body.username)
            res.json({loggedIn: true, username: req.body.username})
        } else {
            console.log("not good")
            res.json({loggedIn: false, status: "Wrong username or password"})
        }
    } else {
        console.log("not good")
        res.json({loggedIn: false, status: "Wrong username or password"})
    }
}