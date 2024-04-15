const mongoose = require('mongoose')

const Schema = mongoose.Schema

const flashcardSchema = new Schema({
    setID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FlashcardSet',
    },
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, { timestamps: true })

module.exports = mongoose.model('Flashcard', flashcardSchema);