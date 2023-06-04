
const User = require('../models/userModel')

// log in 
const loginUser = async (req, res) => {

    res.json({msg: "log in"})

}

// sign up 
const signupUser = async (req, res) => {

    res.json({msg: "sign up"})

}

module.exports = { signupUser, loginUser}