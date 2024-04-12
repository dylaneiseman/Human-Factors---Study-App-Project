const mongoose = require('mongoose')

const Schema = mongoose.Schema

const courseSchema = new Schema({
    // courseID: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    courseName: {
        type: String,
        required: true
    },
    // courseTime: {
    //     type: Number,
    //     required: true,
    //     min: 0
    // },
    intensityRank: { // user entered course intensity ranking 
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    minToStudy: { // amount of time users should spend studying
        type: Number,
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Course', courseSchema)
