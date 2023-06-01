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
    content: {
        type: String,
        required: true
    },
    children: {
      type: [this],
      required: false  
    }

})

module.exports = mongoose.model("Challenge", challengeSchema)


// const challengeSchema = new Schema({

//     name: {
//         type: String,
//         required: true
//     },
//     type: {
//         type: String,
//         required: true
//     },
//     parent: {
//         type: String,
//         required: false
//     },
//     level: {
//         type: Number,
//         required: false
//     },
//     content: {
//         type: String,
//         required: true
//     },
//     children: {
//       type: [this],
//       required: false  
//     }

// }, {timestamps: true})