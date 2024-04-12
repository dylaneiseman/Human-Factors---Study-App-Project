const mongoose = require('mongoose') // npm install mongoose
const bcrypt = require('bcrypt') // npm install bcrypt
const validator = require ('validator') // npm install validator

const Schema = mongoose.Schema

// userSchema 
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    theme: {
        type: Map,
        of: String,
        required: false
    }
})

// static signup method
userSchema.statics.signup = async function(email, password, role = 'user') {

    // validation
    if (!email || !password){
        throw Error('All fields must be filled out.')
    }

    // validate if email is actually an email
    if (!validator.isEmail(email)){
        throw Error('The email is not valid.')
    }

    // validate if user password is strong enough
    if (!validator.isStrongPassword(password)){
        throw Error('The entered password is not strong enough.')
    }

    // validates if email exists
    const exists = await this.findOne({email})
    if (exists){
        throw Error('The email is already in use.')
    }

    // hashing passwords with bcrypt
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await this.create({email, password: hash, role})

    return user
}

// static login method
userSchema.statics.login = async function (email, password) {


    // validate if all fields are filled in
    if (!email || !password) {
        throw Error('All fields must be filled out.')
    }

    // validate if email entered is correct
    const user = await this.findOne({ email })
    if (!user) {
        throw Error('The email entered is incorrect.') // UPDATE TO BE LESS SPECIFIC LATER ON
    }

    // validate if password entered is correct
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error('The password entered is incorrect.') // UPDATE TO BE LESS SPECIFIC LATER ON
    }

    return user
}


module.exports = mongoose.model('User', userSchema)