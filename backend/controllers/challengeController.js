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
        const newLevel = userLevel + 1
        const newQuestionLevel = questionLevel + 1
        console.log(user)
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
                user.level = newLevel
                user.question = 1

            } else {
                newChallenge = await ChallengeModel.findOne({level: userLevel, question: newQuestionLevel, year: currentYear}, {_id:0}).lean()
                user.question = newQuestionLevel
            }

            newChallenge.parent = user.email.split("@")[0]
            const now = new Date();
            const deadline = new Date(now.getTime() + newChallenge.timeLimit * 60 * 60 * 1000);
            // TODO: completed condition ?
            const challenge = user.challenge 
            challenge.children.unshift(ChallengeToSolution(newChallenge))
            challenge.children.filter(e=>e.name==='journal.txt')[0].content += `\n${newChallenge.intro}`
            
            user.status = 'started'
            user.deadline = deadline
            user.challenge = challenge
            
            //TODO: REMOVE DEBUG CODE
            await user.save()
            res.status(200).json({challenge: user.challenge, intro: newChallenge.intro, name: newChallenge.name, timeLimit: newChallenge.timeLimit, deadline: deadline })

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

    //TODO: 1. reuse VERIFY code
    // 2. get result
    // 3. validate result? pass? failed?
    // 4. send res & update 
    // 5. remove solution from user challenge but store it somewhere else .

    console.log("challenge submit")
    // TODO: FRONT END: auto save file before submitting?

    try {
        const _id = req.user._id._id
        const user = await User.findOne({_id})
        const challengeLevel = user.level
        const questionLevel = user.question


        const tester = await Tester.findOne({level: challengeLevel, question: questionLevel, year: currentYear})
        const submissionCode = req.body.code + tester.code
        // const submissionCode = req.body.code

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
        // console.log("got res, json", status, data)
        // {
        //     status: 'ok',
        //     data: 'http://localhost:5001/results/5b17bb811ce012aa6c49'
        //   }
        let statusCode = 0
          // Getting Code Running result
        const fetchResult = async () => {

            fetch(data).then(result => {
                statusCode = result.status
                // console.log(statusCode)
                if (statusCode === 200) {
                    return result.json();
                  } else if (statusCode === 500) {
                    throw new Error('System Error.');
                  } else {
                    throw new Error('Unknown status code.');
                  }
            }).then( resultJson => {
                console.log(resultJson)
                const {status, data} = resultJson
                if(status.trimEnd() === 'ok') {
                    return data
                } else {
                    res.status(500).json({ message: `Error. Status ${status}` })
                    return
                }

                // res.status(200).json({result: "123"})
            }).then(async data => {
                const {status, output} = data
                if(status.trimEnd() === "error") {
                    res.status(200).json({ result: `Error: syntax error.`, status: "error" })
                    return
                } 
                if(status.trimEnd() === 'success' && output === '') {
                    throw new Error('Submission failed. Please make review and make change to your code.');
                }
                
                const outputJson = JSON.parse(output)
                // output: '{"results": [{"result": "passed", "test": "Test 1"}, {"result": "passed", "test": "Test 2"}, ], "status": "passed"}\n',
                if(outputJson.result === 'passed'){
                    user.status = outputJson.status
                    //TODO: REMOVE THIS
                    // user.challenge.children = user.challenge.children.filter(e => e.type === 'file')
                    user.deadline = null
                    //TODO:  -------- DEBUG CODE ------------- 
                    user.level = 0
                    user.question = 0
                    user.totalLevelQuestions = 0
                    user.status = 'new'
                    // end 
                    await user.save()
                }
                const response =  outputJson.status === 'passed' ? 
                     {result: outputJson.results, challenge: user.challenge, deadline: null, status: outputJson.status} 
                     : {result: outputJson.results, status: outputJson.status}

                res.status(200).json(response)

            }).catch(error => {
                // status code 202
                console.log(error.message)
                 if (error.message === 'Unknown status code.') {
                    setTimeout(fetchResult, 1000);
                } else if (statusCode === 500) {
                    res.status(500).json({ message: 'System Error...Try again later.' });
                } else {
                    res.status(406).json({ message: error.message });
                }
            })
        }
        
        status === 'ok' ?
            fetchResult() : res.status(500).json({ message: `Error. Status ${status}` });       

    } catch (error) {
        console.log(error)
        res.status(400).json({message: error.message})
    }

}

exports.verifyChallenge = async (req, res) => {

   const {status, json} =  await codeRunner(req.user._id._id, req.body.code)
    res.status(status).json(json)


    // try {
    //     const _id = req.user._id._id
    //     const user = await User.findOne({_id})
    //     const challengeLevel = user.level
    //     const questionLevel = user.question


    //     const tester = await Tester.findOne({level: challengeLevel, question: questionLevel, year: currentYear})
    //     const submissionCode = req.body.code + tester.code
    //     // const submissionCode = req.body.code

    //     const requestOptions = {
    //         method: 'POST',
    //         headers: { 
    //           'Content-Type': 'application/json',
    //           'authorization': `Bearer ${user?.token}` 
    //         },
    //         body: JSON.stringify({
    //             src: submissionCode,
    //             stdin:"",
    //             lang:"python3",
    //             timeout:5
    //         }	)
    //       }
          
    //     //MARK: ---------- Code Engine API Call ----------
    //     // TODO: CHANGE IT BACK TO SERVICE IN PROD
    //     // const response = await fetch("http://code-engine-server:5001/submit", requestOptions)
    //     const response = await fetch("http://localhost:5001/submit", requestOptions) // REVIEW: USED FOR DEV
    //     const json = await response.json()
    //     const {status, data} = json
   
    //     let statusCode = 0
    //     let attempts = 0
    //     const fetchResult = () => {

    //         fetch(data).then(result => {
    //             statusCode = result.status
    //             // console.log(statusCode)
    //             if (statusCode === 200) {
    //                 return result.json();
    //               } else if (statusCode === 500) {
    //                 throw new Error('System Error.');
    //               } else {
    //                 throw new Error('Unknown status code.');
    //               }
    //         }).then( resultJson => {
    //             console.log(resultJson)
    //             const {status, data} = resultJson
    //             if(status.trimEnd() === 'ok') {
    //                 return data
    //             } else {
    //                 res.status(500).json({ message: `Error. Status ${status}` })
    //                 return
    //             }
    //         }).then( data => {
    //             const {status, output} = data
    //             if(status.trimEnd() === "error") {
    //                 res.status(200).json({ result: `Error: syntax error.`, status: "error" })
    //                 return
    //             } 
    //             if(status.trimEnd() === 'success' && output === '') {
    //                 throw new Error('Submission failed. Please make review and make change to your code.');
    //             }
                
    //             const outputJson = JSON.parse(output)
    //             // output: '{"results": [{"result": "passed", "test": "Test 1"}, {"result": "passed", "test": "Test 2"}, ], "status": "passed"}\n',
    //             const response = {result: outputJson.results, status: outputJson.status}
    //             res.status(200).json(response)
    //             return 

    //         }).catch(error => {
    //             // status code 202
    //             console.log(error.message)
    //              if (error.message === 'Unknown status code.') {
    //                 if(attempts++ <= timeout)
    //                     setTimeout(fetchResult, 1000);
    //                 else 
    //                     res.status(500).json({ message: 'System Error...Try again later.' });
    //             } else if (statusCode === 500) {
    //                 res.status(500).json({ message: 'System Error...Try again later.' });
    //             } else {
    //                 res.status(406).json({ message: error.message });
    //             }
    //         })
    //     }
        
    //     status === 'ok' ?
    //         fetchResult() : res.status(500).json({ message: `Error. Status ${status}` });       

    // } catch (error) {
    //     console.log(error)
    //     res.status(400).json({message: error.message})
    // }

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
   
        const response = await fetch("http://localhost:5001/submit", requestOptions) // REVIEW: USED FOR DEV
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
                    const {status, data} = resultJson
    
                    if(status.trimEnd() !== 'ok') {
                        statusCode = 500
                        throw new Error(`Error. Status ${status}`);
                    }
    
                    if(data.status.trimEnd() === "error") {
                        statusCode = 201
                        throw new Error(`Error: syntax error.`);
                    } 
                    if(data.status.trimEnd() === 'success' && data.output === '') {
                        statusCode = 201
                        throw new Error('Submission failed. Please make review and make change to your code.');
                    }
                    
                    const outputJson = JSON.parse(data.output)
                    console.log('status 200')
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
        console.log(error)
        return {
            status: 400,
            json: { message: error.message }
        }
    }
}

