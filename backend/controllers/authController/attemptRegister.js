const pool = require("../../db/db");
const bcrypt = require("bcrypt");
const {v4: uuidv4} = require("uuid");
module.exports.attemptRegister = async (req, res) => {
    const existingUser = await pool.query("SELECT username from users WHERE username=$1",
        [req.body.username]
    )

    if (existingUser.rowCount === 0) {
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const newUserQuery = await pool.query(
            'INSERT INTO users(username, passhash, userid) values($1,$2,$3) RETURNING id, username, userid',
            [req.body.username, hashedPass, uuidv4()]
        )
        req.session.user = {
            username: req.body.username,
            id: newUserQuery.rows[0].id,
            userid: newUserQuery.rows[0].userid,
        }
        console.log('successfully added')
        res.json({loggedIn: true, username: req.body.username})
    } else {
        console.log('uname: taken')
        res.json({loggedIn: false, status: "Username taken"})
    }
}