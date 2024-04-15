const Scheduler = require('../models/schedulerModel')
const Course = require('../models/courseModel')
const {getUserId} = require("../helpers/getUserId")

const getStudySchedule = async (req, res) => {

    try {
		const userID = getUserId(req)
        const courses = await Course.find({ userID })

        let totalStudyTimePerDay = 0
        courses.forEach(course => {
            totalStudyTimePerDay += course.minToStudy
        })

        const schedulerDates = await Scheduler.findOne({ userID })
        const { semesterStart, semesterEnd } = schedulerDates
        
        // array to hold schedule dates
        let schedule = []

        for (let day = new Date(semesterStart); day <= semesterEnd; day.setDate(day.getDate() + 7)) {
            // time conversions
            let dailyHours = Math.floor(totalStudyTimePerDay / 60) // minutes to hours
            let dailyMinutes = totalStudyTimePerDay % 60 // remaining minutes
            let weeklyHours = (totalStudyTimePerDay / 60) * 7 // weekly total hours

            schedule.push({
                weekStarting: new Date(day),
                dailyStudyTime: `${dailyHours} hours and ${dailyMinutes} minutes per day.`,
                weeklyStudyTime: `${weeklyHours.toFixed(2)} hours per week.`
            })
        }

        res.status(200).json(schedule);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const setSemesterDates = async (req, res) => {
    const { semesterStart, semesterEnd } = req.body

    try {
        const userID = getUserId(req)
        
        // setting time to begin and end at UTC midnight
        const start = new Date(semesterStart);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(semesterEnd);
        end.setUTCHours(0, 0, 0, 0);

        const updateData = {
            semesterStart: start,
            semesterEnd: end
        }

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

