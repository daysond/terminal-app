// Model
const {ChallengeModel} = require('../models/challengeModel')
const User = require('../models/userModel')
const {solutionSchema, SolutionModel, ChallengeToSolution} = require('../models/solutionModel')

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
        const questionLevel = user.question
        const newLevel = userLevel + 1
        const newQuestionLevel = questionLevel + 1

        // checks user level, 0? no futher checking
        let userEligible = userLevel === 0 && questionLevel === 0

        // non 0, validate solutions
        if (userLevel > 0){
            userEligible = user.status === 'passed'
        }
       
        // can request new solution? append solution to user list and save solution also new user level
        if(userEligible) {
            // new level
            console.log("user eligible")
            let newChallenge = null
            if(newQuestionLevel > user.totalLevelQuestions || user.totalLevelQuestions === 0) {
                const newChallenges = await ChallengeModel.find({level: newLevel, year: currentYear}, {_id:0}).lean()
                user.totalLevelQuestions = newChallenges.length
                newChallenge = newChallenges.filter(e=>e.question===1)[0]

            } else {
                newChallenge = await ChallengeModel.findOne({level: userLevel, question: newQuestionLevel, year: currentYear}, {_id:0}).lean()
            }

            newChallenge.parent = user.email.split("@")[0]
            const now = new Date();
            const deadline = new Date(now.getTime() + newChallenge.timeLimit * 60 * 60 * 1000);
            // TODO: completed condition ?
            const challenge = user.challenge 
            challenge.children.unshift(ChallengeToSolution(newChallenge))
            challenge.children.filter(e=>e.name==='journal.txt')[0].content += `\n${newChallenge.intro}`
            user.level = newLevel
            user.status = 'started'
            user.deadline = deadline
            user.challenge = challenge
            await user.save()
            res.status(200).json({challenge: user.challenge, intro: newChallenge.intro, name: newChallenge.name, timeLimit: newChallenge.timeLimit })

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
        const challengeFolder = challenge.children.find(child=> child.type === 'directory')
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
        const response = await fetch("http://159.203.11.15:5001/submit", requestOptions) // REVIEW: USED FOR DEV
        const json = await response.json()
        const {status, data} = json
        console.log("got res, json", status, data)
        // {
        //     status: 'ok',
        //     data: 'http://159.203.11.15:5001/results/5b17bb811ce012aa6c49'
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
                if(output === 'passed'){
                    user.status = output
                    user.challenge.children = user.challenge.children.filter(e => e.type === 'file')
                } else {
                    console.log('failed')
                }
                // TODO: 1. VALIDATE result. pass or failed.
                    // 2. if pass, delete challenge, send res
                    // 3. if failed, send test result

                await user.save()

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