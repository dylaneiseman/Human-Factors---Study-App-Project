const mongoose = require('mongoose')

const schedulerSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    semesterStart: {
        type: Date,
        required: true
    },
    semesterEnd: {
        type: Date,
        required: true
    },
    weeklyStudyTime: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Scheduler', schedulerSchema);
