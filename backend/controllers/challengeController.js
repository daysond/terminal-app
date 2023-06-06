// Model
const {ChallengeModel} = require('../models/challengeModel')
const User = require('../models/userModel')
const Solution = require('../models/solutionModel');

// Get all challenges
const currentYear = new Date().getFullYear();

exports.getChallengeInstruction = async (req, res) => {

    // TODO: append user solutions to challenges..
    try {
        console.log("[DEBUG] Getting challenge instructions. ")
        const _id = req.user._id._id
        const user = await User.findOne({_id})
        // const challengeRoot = await ChallengeModel.findOne({name:"root", year: currentYear}, {_id:0}).lean() // without id
 
        res.status(200).json(user.challenge)
                         
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
}

exports.requestNewChallenge = async (req, res) => {

    try {
        const _id = req.user._id._id
        const user = await User.findOne({_id})
        const userLevel = user.level
        const newLevel = userLevel + 1

        // checks user level, 0? no futher checking
        let userEligible = userLevel === 0

        // non 0, validate solutions
        if (userLevel > 0){
            userEligible = user.status === 'passed'
        }
       
        // can request new solution? append solution to user list and save solution also new user level
        if(userEligible) {
            const newChallenge = await ChallengeModel.findOne({level: newLevel, year: currentYear}, {_id:0}).lean()
            
            // const newSolution = new Solution({
            //     name: newChallenge.name,
            //     level: newChallenge.level,
            //     year: newChallenge.year,
            //     parentID: req.user._id,
            //     code: '# Your solution here \n def solution():',
            //     passed:true, //TODO: CHANGE IT TO FALSE 
            //     submitted: true // TODO: CHANGE IT TO FALSE
            // })

            user.challenge.children.push(newChallenge)
            user.level = newLevel
            user.status = 'started'
            await user.save()
            res.status(200).json(user.challenge)

        } else {

            let message = ''

            switch (user.status) {
                case "started":
                    message = "You need to pass the current challenge to request a new one."
                    break;
                case "failed":
                    message = "Uh oh, you didn't pass the current challenge. Come again next year!"
                case "completed":
                    message = "You have conquered all the challenges! Good job!"
                default:
                    message = "You are not eligible for new challenges."
                    break;
            }

            res.status(400).json({
                message: message
            })
        }

    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }

}

// module.exports = {
//     getFileSystem
// }