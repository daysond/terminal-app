// Model
const challengeModel = require('../models/challengeModel')


// Get all challenges

exports.getChallengeInstruction = async (req, res) => {
    // TODO: USER authentication
    try {
        const currentYear = new Date().getFullYear();
        console.log("[DEBUG] Getting challenge instructions. ")
        const challenges = await challengeModel.find({name:"root", year: currentYear}, {_id:0}).lean() // without id
        res.status(200).json(challenges[0])
                         
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }
}

exports.requestNewChallenge = async (req, res) => {

    try {
        // TODO: instructions should have been stored somewhere, only return new challenge
        const instructions = await challengeModel.find({name:"root"}, {_id:0}).lean()
        // TODO: change magic number level 1 to user level, validate if user is eligible for new request
        const newChallenge = await challengeModel.find({level: 1}, {_id:0}).lean()
        // res.status(200).json({...instructions[0], 
        //                         children: [...instructions[0].children, newChallenge[0]]})
                                // NOTE: USER will create filesystem in frontend using createFS() 
        
        // NOTE: return this, front end should handle the logic
        res.status(200).json(newChallenge[0])
    } catch (error) {
        console.log(error)
        res.status(400).json({error: error.message})
    }

}

// module.exports = {
//     getFileSystem
// }