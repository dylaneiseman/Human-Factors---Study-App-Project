const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectID, // uses mongo unique id for course ID
        ref: 'Course',
        required: true
    },
    assignmentTitle: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    dueDate: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Assignment', assignmentSchema)


