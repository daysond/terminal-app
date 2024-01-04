const mongoose = require('mongoose')
const Schema = mongoose.Schema

const submissionSchema = new Schema({

    email: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true,
        default: 0
    },
    question: {
        type: Number,
        required: false,
        default: 0
    },
    code: {
        type: String,
        required: false
    },
    year: {
        type: Number,
        required: true
    },

}, {timestamps: true})

module.exports = mongoose.model('Submission', submissionSchema)
