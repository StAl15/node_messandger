const pool = require("../../db/db");
const bcrypt = require("bcrypt");
const {v4: uuidv4} = require('uuid')
const {handleLogin} = require("./handleLogin");
const {attemptRegister} = require("./attemptRegister");
const {attemptLogin} = require("./attemptLogin");
const {handleLogout} = require("./handleLogout");


module.exports = {
    attemptLogin,
    attemptRegister,
    handleLogin,
    handleLogout
}