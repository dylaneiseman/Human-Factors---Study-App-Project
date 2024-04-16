const express = require('express')
const router = express.Router()
const { requireAuth } = require('../middleware/authMiddleware')
const checkAccess = require('../middleware/checkAccess')


const {
     getStudySchedule,
     setSemesterDates
    } = require('../controllers/schedulerController')


router.get('/', requireAuth, checkAccess('readOwn', 'scheduler'), getStudySchedule) // get scheduler route
router.post('/', requireAuth, checkAccess('createOwn', 'scheduler'), setSemesterDates) // set semester route

module.exports = router
