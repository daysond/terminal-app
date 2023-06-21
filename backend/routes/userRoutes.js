
const express = require('express')

const router = express.Router()

// Controller
const {signupUser, loginUser, verifyToken} = require("../controllers/userController")
const auth = require('../middleware/authMiddleware')

// Login route
router.post('/login', loginUser)

// Signup route
router.post('/signup', signupUser)

// verify token
router.route('/verify_token').post(auth, verifyToken)

module.exports = router