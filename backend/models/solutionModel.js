
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const solutionSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    parent: {
        type: String,
        required: false
    },
    editable: {
        type: Boolean,
        required: false
    },
    content: {
        type: String,
        required: false
    },
    children: {
      type: [this],
      required: false  
    }
})

const SolutionModel = mongoose.model("Solution", solutionSchema)

const ChallengeToSolution = (challenge) => {
    const solutionRoot = new SolutionModel({
        name: challenge.name,
        type: challenge.type,
        parent: challenge.parent,
        editable: challenge.editable ? challenge.editable : false,
        content: challenge.content,
        children: challenge.children ? challenge.children.map( e => {
            return ChallengeToSolution({...e, parent: challenge.name})
        }) : null
    })

    return solutionRoot
}

module.exports = {solutionSchema, SolutionModel, ChallengeToSolution}

