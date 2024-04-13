const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/authMiddleware')
const checkAccess = require('../middleware/checkAccess')

const {
    createFlashcardSet,
    deleteFlashcardSet,
    updateFlashcardSet,
    getFlashcardSet,
    getAllFlashcardSets
} = require('../controllers/flashcardController')

router.get('/', requireAuth, checkAccess('readOwn', 'flashcard'), getAllFlashcardSets);
router.get('/:id', requireAuth, checkAccess('readOwn', 'flashcard'), getFlashcardSet);
router.post('/', requireAuth, checkAccess('createOwn', 'flashcard'), createFlashcardSet);
router.delete('/:id', requireAuth, checkAccess('readOwn', 'flashcard'), deleteFlashcardSet);
router.put('/:id', requireAuth, checkAccess('updateOwn', 'flashcard'), updateFlashcardSet);

module.exports = router