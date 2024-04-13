const mongoose = require('mongoose')

const Schema = mongoose.Schema

const flashcardSetSchema = new Schema({
    setName: {
        type: String,
        required: true,
    },
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, { timestamps: true })

module.exports = mongoose.model('FlashcardSet', flashcardSetSchema);