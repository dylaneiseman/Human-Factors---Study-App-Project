const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware')
const checkAccess = require('../middleware/checkAccess')



const {
    createAssignment,
    getToDoList,
    getAssignment,
    updateAssignment,
    deleteAssignment
} = require('../controllers/assignmentController');

router.post('/', requireAuth, checkAccess('createOwn', 'assignment'), createAssignment); // create assignment
router.put('/:id', requireAuth, checkAccess('updateOwn', 'assignment'), updateAssignment); // update assignment by ID
router.delete('/:id', requireAuth, checkAccess('deleteOwn', 'assignment'), deleteAssignment); // delete assignment by ID
router.get('/:id', requireAuth, checkAccess('readOwn', 'assignment'), getAssignment); // get assignment by ID
router.get('/', requireAuth, checkAccess('readOwn', 'assignment'), getToDoList);  // get all assignments


module.exports = router;
