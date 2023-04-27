const express = require('express')
const router = express.Router()
const Yup = require("yup")
const validateForm = require("../controllers/validateForm")
const pool = require('../db/db.js')
const bcrypt = require("bcrypt")
const {
    handleLogin,
    attemptLogin,
    attemptRegister,
    handleLogout
} = require("../controllers/authController/authController");
const {rateLimiter} = require("../controllers/rateLimiter");


router
    .route("/login")
    .get(handleLogin)
    .post(validateForm, rateLimiter(60, 10), attemptLogin)

router
    .route("/logout")
    .get(handleLogout)

router.post(
    '/register',
    validateForm,
    rateLimiter(30, 4),
    attemptRegister)

module.exports = router