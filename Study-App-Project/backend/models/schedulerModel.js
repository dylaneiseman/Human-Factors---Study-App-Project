const mongoose = require('mongoose')

const schedulerSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    assignmentID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    },
    completed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Scheduler', schedulerSchema);