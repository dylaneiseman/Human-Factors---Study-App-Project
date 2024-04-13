const mongoose = require('mongoose')

const Schema = mongoose.Schema

const flashcardSchema = new Schema({
    flashCardGroupID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'FlashcardGroup',
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