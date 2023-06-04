const mongoose = require('mongoose')

const Schema = mongoose.Schema

const solutionSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
      },
    year: {
        type: Number,
        required: false
    },

    code: {
        type: String,
        required: true
    },
    passed: {
        type: Boolean,
        default: false,
        required: true
    },
    submitted: {
        type: Boolean,
        default: false,
        required: true
    }
})

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    solutions: [solutionSchema]
})

module.exports = mongoose.model("User", userSchema)

