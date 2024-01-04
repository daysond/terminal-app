
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
        console.log("id is ", _id)
        req.user = await User.findOne({_id})
        
        console.log(req.user)

        const now = Date.now()
        const deadline = req.user.deadline
    
        if (deadline !== null && now >= deadline) {
            req.user.status = 'timeout'
            await req.user.save()
        }
    
        console.log('DEBUG: Auth User')
        next()

    } catch (error) {
        console.log("DEBUG: STRANGE ERROR ", error)
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized. Invalid token.'
        })
    }

}

module.exports = auth