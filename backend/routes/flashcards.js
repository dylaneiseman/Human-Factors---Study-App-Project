const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware')
const checkAccess = require('../middleware/checkAccess')

const{
    createFlashcard,
    deleteFlashcard,
    updateFlashcard,
    createFlashcardGroup,
    deleteFlashcardGroup,
    updateFlashcardGroup,
    getFlashcardsFromGroup,
    getFlashcardGroupsFromUser
} = require('../controllers/flashcardController')

router.get('/', requireAuth, checkAccess('readOwn', 'flashcard'), getFlashcardGroupsFromUser);
router.get('/:flashCardGroupID', requireAuth, checkAccess('readOwn', 'flashcard'), getFlashcardsFromGroup);
router.post('/', requireAuth, checkAccess('createOwn', 'flashcard'), createFlashcardGroup);
router.post('/:flashCardGroupID', requireAuth, checkAccess('createOwn', 'flashcard'), createFlashcard);
router.delete('/', requireAuth, checkAccess('readOwn', 'flashcard'), deleteFlashcardGroup);
router.delete('/:flashCardGroupID', requireAuth, checkAccess('deleteOwn', 'flashcard'), deleteFlashcard);
router.patch('/', requireAuth, checkAccess('updateOwn', 'flashcard'), updateFlashcardGroup);
router.patch('/:flashCardGroupID', requireAuth, checkAccess('updateOwn', 'flashcard'), updateFlashcard);

module.exports = router