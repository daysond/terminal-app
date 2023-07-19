
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const auth = async (req, res, next) => {

    // console.log("pretend there's user")
    // next()
    // return 
    console.log('auth called...')

    const { authorization } = req.headers

    if(!authorization) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized.'
        })
    }

    const token = authorization.split(' ')[1]

    try {
        const {_id} = jwt.verify(token, process.env.JWT_SECRET)

        // req.user = await User.findOne({_id}).select('_id')
        req.user = await User.findOne({_id})
        console.log('DEBUG: Auth User')
        next()

    } catch (error) {
        console.log("DEBUG: STRANGE ERROR")
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized. Invalid token.'
        })
    }

}

module.exports = auth