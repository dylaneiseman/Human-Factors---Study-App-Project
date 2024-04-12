const express = require('express')

// controller functions
const {signupUser, loginUser, getUser, updateUser} = require('../controllers/userController')
const {requireAuth} = require('../middleware/authMiddleware')

const router = express.Router()

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

router.get('/', requireAuth, getUser)

router.put('/', requireAuth, updateUser)

module.exports = router