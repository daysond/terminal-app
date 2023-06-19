const {challengeSchema, ChallengeModel} = require('./challengeModel')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const testerSchema = new Schema({

    challengeName: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    question: {
        type: Number,
        required: true
    },
    code: {
      type: String,
      required: true  
    }
})

// const TesterModel = mongoose.model("Tester", testerSchema)

// module.exports = {testerSchema, TesterModel}

module.exports = mongoose.model("Tester", testerSchema)


