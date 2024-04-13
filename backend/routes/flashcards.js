const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware')
const checkAccess = require('../middleware/checkAccess')

const {
    getAllFlashcards,
    createFlashcard,
    deleteFlashcard,
    updateFlashcard
} = require('../controllers/flashcardController')

router.get('/', requireAuth, checkAccess('readOwn', 'flashcard'), getAllFlashcards);
router.post('/', requireAuth, checkAccess('createOwn', 'flashcard'), createFlashcard);
router.delete('/:id', requireAuth, checkAccess('deleteOwn', 'flashcard'), deleteFlashcard);
router.put('/:id', requireAuth, checkAccess('updateOwn', 'flashcard'), updateFlashcard);

module.exports = router