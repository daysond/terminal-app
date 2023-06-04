const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator') 

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
}, {timestamps: true})

// MARK: ------ static methods ------

userSchema.statics.signup = async function(email, password) {

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

    const user = await this.create({email, password: hash, level: 0, solutions: []})

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

