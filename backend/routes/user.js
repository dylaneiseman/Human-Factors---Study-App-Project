const express = require('express')

// controller functions
const {signupUser, loginUser, getUser, updateUser} = require('../controllers/userController')
const {requireAuth} = require('../middleware/authMiddleware')

const router = express.Router()


router.post('/login', loginUser) // login route
router.post('/signup', signupUser) // signup route
router.get('/', requireAuth, getUser) // get user route
router.put('/', requireAuth, updateUser) // update user rotue

module.exports = router