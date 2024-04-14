const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware')
const checkAccess = require('../middleware/checkAccess')

const{
    createFlashcard,
    getFlashcard,
    deleteFlashcard,
    updateFlashcard,
    createFlashcardGroup,
    getFlashcardGroup,
    deleteFlashcardGroup,
    updateFlashcardGroup,
    getFlashcardsFromGroup,
    getFlashcardGroupsFromUser
} = require('../controllers/flashcardController')

router.get('/', requireAuth, checkAccess('readOwn', 'flashcard'), getFlashcardGroupsFromUser);
router.get('/:id', requireAuth, checkAccess('readOwn', 'flashcard'), getFlashcardsFromGroup);
router.get('/card/:id', requireAuth, checkAccess('readOwn', 'flashcard'), getFlashcard)
router.get('/group/:id', requireAuth, checkAccess('readOwn', 'flashcard'), getFlashcardGroup)
router.post('/group/', requireAuth, checkAccess('createOwn', 'flashcard'), createFlashcardGroup);
router.post('/', requireAuth, checkAccess('createOwn', 'flashcard'), createFlashcard);
router.delete('/group/:id', requireAuth, checkAccess('deleteOwn', 'flashcard'), deleteFlashcardGroup);
router.delete('/:id', requireAuth, checkAccess('deleteOwn', 'flashcard'), deleteFlashcard);
router.put('/group/:id', requireAuth, checkAccess('updateOwn', 'flashcard'), updateFlashcardGroup);
router.put('/:id', requireAuth, checkAccess('updateOwn', 'flashcard'), updateFlashcard);

module.exports = router