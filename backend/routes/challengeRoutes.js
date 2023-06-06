
const express = require('express')
const mongoose = require('mongoose')
// Middleware
const auth = require('../middleware/authMiddleware')
//Controller
const challengeController = require('../controllers/challengeController')

const router = express.Router()

// checking for user authentication
// auth protect for all routes
router.use(auth)

router.route('/')
    .get(challengeController.getChallengeInstruction)

// Request single challenge
router.route('/request')
    .post(challengeController.requestNewChallenge)

// Get progress
router.get('/progress', (req, res) => {
    res.json({
        msg: "progress"
    })
})

// Save progress
router.patch('/save/:id', (req, res) => {

    // NOTE: check if id is valid first to avoid error
    if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
        console.log("invalid id")
        return 
    }

    res.json({
        msg: "save"
    })
})

// Verify Code
router.post('/verify/:id', async (req, res) => {

    const {data} = req.body

    try {
        // const solution = await....
    } catch (error) {
        console.log(error)
    }

    res.json({
        data: req.body
    })
})

// Submit Code
router.post('/submit/:id', (req, res) => {
    res.json({
        msg: "submit"
    })
})


module.exports = router