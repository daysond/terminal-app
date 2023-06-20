const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator') 

const {challengeSchema, ChallengeModel} = require('./challengeModel')
const {solutionSchema, SolutionModel, ChallengeToSolution} = require('./solutionModel')

const currentYear = new Date().getFullYear();

const Schema = mongoose.Schema

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
        required: true,
        default: 1
    },
    question: {
        type: Number,
        required: true,
        default: 1
    },
    totalLevelQuestions: {
        type: Number,
        required: true,
        default:1
    },
    status: {
        type: String,
        required: true,
        enum: ['new', 'started' ,'passed', 'timeout', 'completed'],
        default: "new"
    },
    deadline: {
        type: Date,
        required: false,
        default: null,
    },
    challenge: {
        type: solutionSchema,
        required: true
    }
}, {timestamps: true})

// MARK: ------ static methods ------

userSchema.statics.signup = async function(email, password) {
    console.log("[debug] about to signing up")
    // input validation
    if(!email || !password) {
        throw Error('All fields must be filled.')
    }

    if(!validator.isEmail(email, {host_whitelist: ["myseneca.ca"]})) {
        throw Error('Invalid Seneca email address. Access is by invitation only.')
    }

    if(!/^[a-zA-Z0-9~!@#$%^&*(),.?]+$/.test(password) ) {
        throw Error("Only letters, numbers and symbols ~!@#$%^&*(),.? are allowed in password.")
    }

    if(!validator.isStrongPassword(password, {minLowercase: 1, minUppercase: 1, minSymbols: 0 })) {
        throw Error('Password must be at least 8 charaters and include at least one lowercase letter and one uppercase letter.')
    }

    // checking if email exists
    const exists = await this.findOne({email})

    if (exists) {
        throw Error('Email already in use. Please log in.')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)


    const challengeRoot = await ChallengeModel.findOne({name:"root", year: currentYear}, {_id:0}).lean()
    challengeRoot.name = email.split("@")[0]
    const solutionRoot = ChallengeToSolution(challengeRoot)
    const user = await this.create({email, password: hash, deadline: null, challenge: solutionRoot})

    return user

}

userSchema.statics.login = async function(email, password) {

    if(!email || !password) {
        throw Error('All fields must be filled.')
    }

    const user = await this.findOne({email})

    if (!user) {
        throw Error('Invalid email or password.')
    }

    const match = await bcrypt.compare(password, user.password)
    
    if (!match) {
        throw Error('Invalid email or password.')
    }

    return user

}

module.exports = mongoose.model("User", userSchema)

