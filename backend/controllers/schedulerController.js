const Scheduler = require('../models/schedulerModel')
const Course = require('../models/courseModel')
const {getUserId} = require("../helpers/getUserId")

// get user study schedule
const getStudySchedule = async (req, res) => {

    try {
		const userID = getUserId(req)
        const courses = await Course.find({ userID })

        let totalStudyTimePerDay = 0
        courses.forEach(course => {
            totalStudyTimePerDay += course.minToStudy
        })

        const schedulerDates = await Scheduler.findOne({ userID })

        res.status(200).json({ schedule: schedulerDates, total: totalStudyTimePerDay });
    } catch (error) {
        res.status(400).json(error.message);
    }
}

// set semester start and end dates
const setSemesterDates = async (req, res) => {
    const updateData = req.body

    try {
        const userID = getUserId(req)
        const updatedSemester = await Scheduler.findOneAndUpdate({ userID }, updateData, { new: true, upsert: true, setDefaultsOnInsert: true })

        res.status(200).json({ message: 'The semester dates were set successfully.', semester: updatedSemester })
    } catch (error) {
        res.status(400).json('Failed to set the semester dates: ' + error.message)
    }
}

module.exports = {
    getStudySchedule,
    setSemesterDates
}

