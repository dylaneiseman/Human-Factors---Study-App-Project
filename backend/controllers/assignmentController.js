const Assignment = require('../models/assignmentModel')
const Course = require('../models/courseModel')
const mongoose = require('mongoose')
const {getUserId} = require("../helpers/getUserId")

// create new assignment
const createAssignment = async (req, res) => {
	const { courseID, assignmentTitle, description, dueDate } = req.body

	// add assignment to db
	try {
        const userID = getUserId(req)
        // check to prevent users from creating assignments in other courses
        const course = await Course.findOne({ _id: courseID, userID: userID })
        if (!course) {
            return res.status(403).json({ error: 'You do not have permission to add assignments to this course.' })
        }

        // if check passes, proceed with creating assignment
		const assignment = await Assignment.create({ courseID, assignmentTitle, description, dueDate, userID })
		res.status(200).json(assignment)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}


// update an assignment by ID
const updateAssignment = async (req, res) => {
    const { id } = req.params
    const updateData = req.body
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'The assignment does not exist.' })
	}

    try {
        const userID = getUserId(req)
        const assignment = await Assignment.findOneAndUpdate({ _id: id, userID: userID }, updateData, {new: true});
        res.status(200).json(assignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// delete an assignment by ID
const deleteAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const userID = getUserId(req)
        const assignment = await Assignment.findOneAndDelete({_id:id , userID: userID })
        if (!assignment) {
            return res.status(404).json({ error: 'This assignment does not exist.' })
        }
        res.status(200).json({ message: 'The assignment was deleted successfully.' })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get all assignments by course
const getAssignmentsByCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const userID = getUserId(req)
        // check to prevent users from getting assignments from other courses
        const course = await Course.findOne({ _id: id, userID })
        if (!course) {
            return res.status(403).json({ error: 'You do not have permission to see assignments from this course.' })
        }

        const assignments = await Assignment.find({ courseID: id, userID });
        if (assignments.length === 0) {
            return res.status(404).json({ error: 'No assignments found for this course.' });
        }
        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get all assignments
const getToDoList = async (req, res) => {
    try {
        const userID = getUserId(req)
        const assignments = await Assignment.find({ userID }).collation({locale:'en',strength: 2}).sort({ dueDate: 1 })
        res.status(200).json(assignments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get an assignment by ID
const getAssignment = async (req, res) => {
    const { id } = req.params;
    try {
        const userID = getUserId(req)
        const assignment = await Assignment.findOne({_id: id, userID: userID})
        if (!assignment) {
            return res.status(404).json({ error: 'This assignment does not exist.' });
        }
        res.status(200).json(assignment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



module.exports = {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentsByCourse,
    getAssignment,
    getToDoList
};