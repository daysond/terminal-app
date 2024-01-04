
const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

// Create Token
const createToken = (_id) => {
    return jwt.sign({_id: _id}, process.env.JWT_SECRET, {expiresIn: '7d'})
}

// log in 
const loginUser = async (req, res) => {

    console.log("debug: login")

    const {email, password} = req.body
    
    try {
        
        const user = await User.login(email, password)

        const token = createToken(user._id)

        const now = Date.now()
        const deadline = user.deadline
        if(deadline !== null && now >= deadline) {
            user.status = 'timeout'
            await user.save()
        }

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
    
    //TODO: return user as response (same as user login )


    if (req.user) {
        const user = {
            ...req.user.toObject()
        }

        delete user.password
        delete user._id

        // console.log('DEBUG: verifying user...', user)

        res.status(200).json({
            status: 'Success',
            message: 'User verified.',
            user: user
        }) 
       
    } else {
        console.log('DEBUG: 401 not found')
        res.status(401).json({
            status: 'Unauthorized',
            message: 'Token valid but user was not found.'
        })

    }
}


module.exports = { signupUser, loginUser, verifyToken}