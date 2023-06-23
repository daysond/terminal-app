// Model
const {ChallengeModel} = require('../models/challengeModel')
const User = require('../models/userModel')
const {solutionSchema, SolutionModel, ChallengeToSolution} = require('../models/solutionModel')
const Tester = require('../models/testerModel')

// Get all challenges
const currentYear = new Date().getFullYear();
const timeout = 15

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
      
        console.log(user)
        // checks user level, 0? no futher checking
        const userEligible = user.status === 'new' || user.status === 'passed' || user.status === 'submitted'

        // can request new solution? append solution to user list and save solution also new user level
        if(userEligible) {
            // new level
            console.log("user eligible")

            const newChallenge = await ChallengeModel.findOne({level: userLevel, question: questionLevel, year: currentYear}, {_id:0}).lean()
            console.log('new challenge: ', newChallenge)
            newChallenge.parent = user.email.split("@")[0]
            const now = new Date();
            const deadline = new Date(now.getTime() + newChallenge.timeLimit * 60 * 60 * 1000);
            // TODO: completed condition ?
            const challenge = user.challenge 
            challenge.children.unshift(ChallengeToSolution(newChallenge))
            challenge.children.filter(e=>e.name==='journal.txt')[0].content += `\n\n${newChallenge.intro}`
            
            user.status = 'started'
            user.deadline = deadline
            user.challenge = challenge
            
            //TODO: REMOVE DEBUG CODE
            const userCopy = {...user.toObject()}
            delete userCopy.password
            delete userCopy._id
            const response = {user: userCopy, intro: newChallenge.intro, name: newChallenge.name, timeLimit: newChallenge.timeLimit }
            
            await user.save()
            res.status(200).json(response)

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

exports.saveChallenge = async (req, res) => {

    try {
        const _id = req.user._id._id
        const {level, content} = req.body
       
        const user = await User.findOne({_id})
        console.log(user)
        const challenge = user.challenge
        const challengeFolder = challenge.children.find(child=> child.type === 'directory')
        const file = challengeFolder.children.find(child=> child.name === 'solution.py')
        file.content = content
        user.challenge = challenge

        await user.save()

        res.status(200).json(challenge)

        
    } catch (error) {
        console.log(error)
        res.status(400).json({message: error})
    }

}

exports.submitChallenge = async (req, res) => {

    //TODO: 1. reuse VERIFY code
    const _id = req.user._id._id
    const response =  await codeRunner(_id, req.body.code)
    const status = response.json.status
    const result = response.json.result
    console.log(status)
    // res.status(response.status).json(response.json)

    if(status === 'failed') {
        const response =   {result: result, status: status} 
        res.status(200).json(response)
    }

    if(status === 'error') {
        const response =   {result: result, status: status} 
        res.status(201).json(response)
    }

    if(status === 'passed') {
        
        const user = await User.findOne({_id})
        let outro = null
        console.log(user)
        
        //TODO: REMOVE comment
        if(user.level === 5 && user.question === user.totalLevelQuestions) {
            user.status = 'completed'
        } else if(user.question === user.totalLevelQuestions) {
            // update user to new level
            const newChallenges = await ChallengeModel.find({level: user.level + 1, year: currentYear}, {_id:0}).lean()
            const currentChallenge = await ChallengeModel.findOne({level: user.level, question: user.question, year: currentYear}, {_id:0}).lean()
            outro = currentChallenge.outro
            user.challenge.children.filter(e=>e.name==='journal.txt')[0].content += `\n\n${outro}`
            user.totalLevelQuestions = newChallenges.length
            user.level+=1
            user.question = 1
            user.status = status
        } else {
            // update user to new question
            user.status = 'submitted'
            user.question += 1
        }
        user.challenge.children = user.challenge.children.filter(e => e.type === 'file')
        user.deadline = null

        //TODO:  -------- DEBUG CODE ------------- 
        // user.level = 0
        // user.question = 0
        // user.totalLevelQuestions = 0
        // user.status = 'new'
        // end 
        
        const userCopy = {...user}
        delete userCopy.password
        delete userCopy._id
        const response =   {result: result, user: user, deadline: null, status: status, outro: outro} 
        
        await user.save()
        res.status(200).json(response)
    }

}

exports.verifyChallenge = async (req, res) => {

   const {status, json} =  await codeRunner(req.user._id._id, req.body.code)
    res.status(status).json(json)


}

// MARK: ----------------------- HELPER FUNCTIONS -----------------------

const codeRunner = async (_id, code) => {

    try {
    
        const user = await User.findOne({_id})
        const tester = await Tester.findOne({level: user.level, question: user.question, year: currentYear})
        const submissionCode = code + tester.code

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
   
        const response = await fetch("http://159.203.11.15:5001/submit", requestOptions) // REVIEW: USED FOR DEV
        const json = await response.json()
        const {status, data} = json
   
        let statusCode = 0
        let attempts = 0

        if (status === 'ok') {

            while (statusCode !== 200) {
                const result = await fetch(data)
                statusCode = result.status
    
                if(statusCode === 202 && attempts++ <= timeout) {
                    await new Promise((resolve) => setTimeout(resolve, 1000)) 
                    
                } else if (statusCode === 200) {
    
                    const resultJson = await result.json()
                    console.log('json', resultJson)
                    const {status, data} = resultJson
                    console.log("====== data =====")
                    console.log(data)
    
                    if(status.trimEnd() !== 'ok') {
                        statusCode = 500
                        throw new Error(`Error. Status ${status}`);
                    }
    
                    if(data.status.trimEnd() === "error") {
                        throw new Error(`Error: Invalid solution. Make sure there's no syntax error.`);
                    } 
                    if(data.status.trimEnd() === 'success' && data.output === '') {
                        throw new Error('Submission failed. Please make review and make change to your code.');
                    }
                    
                    const outputJson = JSON.parse(data.output)

                    console.log(outputJson)
    
                    return{
                        status: 200,
                        json: {result: outputJson.results, status: outputJson.status}
                    }
    
                } else {
                    throw new Error('System Error.');
                }
            }
  
        } else {
            return {
                status: 500,
                json: { message: `Error. Status ${status}` }
            }
        }

    } catch (error) {
        console.log('====error ===')
        console.log(error)
        return {
            status: 400,
            json: { message: error.message }
        }
    }
}

