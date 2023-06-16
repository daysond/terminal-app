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
        const _id = req.user?._id._id
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
            // TODO: completed condition ?

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

exports.saveChallenge = async (req, res) => {

    try {
        const _id = req.user._id._id
        const {level, content} = req.body
        
        console.log(level, content)
        const user = await User.findOne({_id})

        const challenge = user.challenge
        const challengeFolder = challenge.children.find(child=> child.level === level)
        const file = challengeFolder.children.find(child=> child.name === 'solution.py')
        file.content = content
        user.challenge = challenge

        await user.save()

        res.status(200).json(challenge)

        
    } catch (error) {
        res.status(400).json({message: error})
    }

}

exports.submitChallenge = async (req, res) => {

    console.log("challenge submit")

    try {
        const _id = req.user._id._id
        const user = await User.findOne({_id})
        const challengeLevel = req.body.level
        const submissionCode = req.body.code

        // console.log(submissionCode)

        const requestOptions = {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'authorization': `Bearer ${user?.token}` 
            },
            body: JSON.stringify({
                src: submissionCode,
                stdin:"",
                lang:"python3",
                timeout:5
            }	)
          }
          
        //MARK: ---------- Code Engine API Call ----------
        // TODO: CHANGE IT BACK TO SERVICE IN PROD
        // const response = await fetch("http://code-engine-server:5001/submit", requestOptions)
        const response = await fetch("http://localhost:5001/submit", requestOptions) // REVIEW: USED FOR DEV
        const json = await response.json()
        const {status, data} = json
        console.log("got res, json", status, data)
        // {
        //     status: 'ok',
        //     data: 'http://localhost:5001/results/5b17bb811ce012aa6c49'
        //   }
        let statusCode = 0
          // Getting Code Running result
        const fetchResult = async () => {

            fetch(data).then(result => {
                statusCode = result.status
                console.log(statusCode)
                if (statusCode === 200) {
                    return result.json();
                  } else if (statusCode === 500) {
                    throw new Error('System Error.');
                  } else {
                    throw new Error('Unknown status code.');
                  }
            }).then( async resultJson => {
                const output = resultJson.data.output.trim()
                user.status = output

                // MARK: REPEATED CODE, marking file not editable aka submitable
                // REVIEW: on client end, editable is not synced.
                const challenge = user.challenge
                const challengeFolder = challenge.children.find(child=> child.level === challengeLevel)
                const file = challengeFolder.children.find(child=> child.name === 'solution.py')
                file.editable = false
                user.challenge = challenge

                await user.save()
                console.log("user saved")
                return output
                // res.status(200).json({result: "123"})
            }).then(output => {
                console.log("output ", output)
                res.status(200).json({result: output})

            }).catch(error => {
                // status code 202
                 if (error.message === 'Unknown status code.') {
                    setTimeout(fetchResult, 500);
                } else {
                    res.status(500).json({ message: 'System Error.' });
                } 
            })
        }
          
        fetchResult()

    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
    }

}