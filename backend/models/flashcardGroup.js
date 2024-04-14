const mongoose = require('mongoose')

const Schema = mongoose.Schema

const flashcardGroupSchema = new Schema({
    groupName: {
        type: String,
        required: true,
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }
}, { timestamps: true })

module.exports = mongoose.model('FlashcardGroup', flashcardGroupSchema);