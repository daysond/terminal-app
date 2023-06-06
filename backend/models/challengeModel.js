const mongoose = require('mongoose')

const Schema = mongoose.Schema

const challengeSchema = new Schema({

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
    level: {
        type: Number,
        required: false
    },
    editable: {
        type: Boolean,
        required: false
    },
    year: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    children: {
      type: [this],
      required: false  
    }
}, {_id: false, timestamps: true})

// challengeSchema.index({ name: 1, year: 1 }, { unique: true });

const ChallengeModel = mongoose.model("Challenge", challengeSchema)

module.exports = {challengeSchema, ChallengeModel}

