
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// Create Token
const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

// log in 
const loginUser = async (req, res) => {

    const {email, password} = req.body
    
    try {
        
        const user = await User.login(email, password)

        const token = createToken(user._id)

        const response = {
            token,
            ...user.toObject()
        }

        delete response.password
        delete response._id

        res.status(200).json(response)


    } catch (error) {
        res.status(400).json({error: error.message})
    }


}

// sign up 
const signupUser = async (req, res) => {
    // TODO: CONFIRM password here or in react
    const {email, password} = req.body
    
    try {
        
        const user = await User.signup(email, password)

        const token = createToken(user._id)

        const response = {
            token,
            ...user.toObject()
        }

        delete response.password
        delete response._id
        
        res.status(200).json(response)


    } catch (error) {
        res.status(400).json({error: error.message})
    }

}

const verifyToken = async (req, res) => {
    
    return req.user ? 
    res.status(200).json({
        status: 'Success',
        message: 'User verified.'
    }) :
    res.status(401).json({
        status: 'Unauthorized',
        message: 'Token valid but user was not found.'
    })
}

module.exports = { signupUser, loginUser, verifyToken}