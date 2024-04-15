const Course = require('../models/courseModel')
const Set = require('../models/flashcardSetModel')
const mongoose = require('mongoose')
const {getUserId} = require("../helpers/getUserId")

// get all courses
const getAllCourses = async (req, res) => {
	try{
		const userID = getUserId(req)
		const courses = await Course.find({ userID }).collation({locale:'en',strength: 2}).sort({ courseName: 1 })
		res.status(200).json(courses)
	} catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// get a single course
const getCourse = async (req, res) => {
	const { id } = req.params
	try {
		const userID = getUserId(req)
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({error: 'The course does not exist.'})
		}
		const course = await Course.findOne({_id: id, userID})
		const sets = await Set.find({courseID: id, userID: userID}).collation({locale:'en',strength: 2}).sort({setName: 1});
		if (!course) {
			return res.status(404).json({error: 'The course does not exist.'})
		}
		res.status(200).json({course: course, sets: sets})
	} catch(error) {
		res.status(400).json({ error: error.message })
	}
}


// create new course
const createCourse = async (req, res) => {
	const {courseName, intensityRank} = req.body
	const minToStudy = intensityRankMap(intensityRank)

	// add course to db
	try {
		const userID = getUserId(req)
		const course = await Course.create({ courseName, intensityRank, minToStudy, userID })
		res.status(200).json(course)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

// delete a course
const deleteCourse = async (req, res) => {
	const { id } = req.params

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'The course does not exist.' })
	}
	try {
		const userID = getUserId(req)
		const course = await Course.findOneAndDelete({ _id: id, userID: userID })
		if (!course) {
			return res.status(404).json({ error: 'The course does not exist.' })
		}
		res.status(200).json(course)
	
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

// update a course
const updateCourse = async (req, res) => {
	const { id } = req.params
	let updateData = req.body
	
	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'The course does not exist.' })
	}
	// update the course's intensity rank 
	if (updateData.intensityRank) {
		updateData.minToStudy = intensityRankMap(updateData.intensityRank) 
	}
	
	try{
		const userID = getUserId(req)
		const course = await Course.findOneAndUpdate({ _id: id, userID: userID }, updateData, {new: true});
		res.status(200).json(course);
	} catch (error) {
        res.status(400).json({ error: error.message });
	}
};


// maps intensity rank to amount of minutes to study for
function intensityRankMap(intensityRank){
	return intensityRank > 0 ? intensityRank * 30 : 0;
}


module.exports = {
	getAllCourses,
	getCourse,
	createCourse,
	deleteCourse,
	updateCourse,
	intensityRankMap
}