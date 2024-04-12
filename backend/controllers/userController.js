const User = require('../models/userModel')
const jwt = require('jsonwebtoken') // npm install jsonwebtoken
const {getUserId} = require("../helpers/getUserId")

// function to create jwt
const createToken = (_id, role ) => {
    return jwt.sign({ _id, role }, process.env.SECRET, {expiresIn: '7d'})
}

// signup user
const signupUser = async (req, res) => {
    const {email, password, role} = req.body

    try{
        const user = await User.signup(email, password, role)

        // create a token
        const token = createToken(user._id, user.role)

        res.status(200).json({email, token, role: user.role })
    } 
    catch (error){
        res.status(400).json({error: error.message})    }
}

// login user
const loginUser = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.login(email, password)

        // create a token
        const token = createToken(user._id, user.role)

        res.status(200).json({ email, token, role: user.role })
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// user details
const getUser = async (req, res) => {
    try {
        const userID = getUserId(req)
        const user = await User.findById(userID);
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// update user details
const updateUser = async (req, res) => {
    const updateData = req.body
    
    try {
        const userID = getUserId(req)
        const user = await User.findByIdAndUpdate(userID, updateData, {new: true});
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {signupUser, loginUser, getUser, updateUser}