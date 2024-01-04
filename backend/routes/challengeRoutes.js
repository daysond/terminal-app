
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

// Submit Code
router.route('/submit')
    .post(challengeController.submitChallenge) 

router.route('/verify')
    .post(challengeController.verifyChallenge) 
// Save file
router.route('/save')
    .patch(challengeController.saveChallenge)


// Get progress
router.get('/progress', (req, res) => {
    res.json({
        msg: "progress"
    })
})




module.exports = router