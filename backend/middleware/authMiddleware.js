const auth = (req, res, next) => {

    console.log("pretend there's user")
    next()
    // const {user} = req.session

    // if(!user) {
    //     return res.status(401).json({
    //         status: 'fail',
    //         message: 'unauthorized'
    //     })
    // }

    // req.user = user

    // next()
}

module.exports = auth