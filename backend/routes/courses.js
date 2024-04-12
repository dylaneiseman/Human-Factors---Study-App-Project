const express = require('express')
const { requireAuth } = require('../middleware/authMiddleware')
const checkAccess = require('../middleware/checkAccess')



const {
	createCourse,
	getAllCourses,
	getCourse,
	deleteCourse,
	updateCourse
} = require('../controllers/courseController')

const { getAssignmentsByCourse } = require('../controllers/assignmentController'); // importing assignmentController

const router = express.Router()


router.get('/', requireAuth, checkAccess('readOwn', 'course'), getAllCourses) // GET all user courses
router.get('/:id', requireAuth, checkAccess('readOwn', 'course'), getCourse) // GET a single course
router.post('/', requireAuth, checkAccess('createOwn', 'course'), createCourse) // POST a new course
router.delete('/:id', requireAuth, checkAccess('deleteOwn', 'course'), deleteCourse) // DELETE a course
router.put('/:id', requireAuth, checkAccess('updateOwn', 'course'), updateCourse) // UPDATE a course
router.get('/:id/assignments', requireAuth, checkAccess('readOwn', 'course'), getAssignmentsByCourse) // get all assignments by course ID


module.exports = router