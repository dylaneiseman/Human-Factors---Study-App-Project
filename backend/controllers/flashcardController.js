const Flashcard = require('../models/flashcardModel')
const FlashcardSet = require('../models/flashcardSetModel')
const mongoose = require('mongoose')
const {getUserId} = require("../helpers/getUserId")

// create individual flashcards
const createFlashcard = async (req, res) =>{
    const {setID, question, answer} = req.body;

    try{
        const userID = getUserId(req);
        const set = await FlashcardSet.findOne({_id: setID, userID: userID});
        if(!set){
           return res.status(403).json('Could not add flashcard to group.')
        }
        const flashcard = await Flashcard.create({setID, question, answer, userID});
        res.status(200).json(flashcard)

    }catch(error){
        res.status(400).json(error.message);
    }
}

// delete flashcards
const deleteFlashcard = async (req, res) =>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json( 'Flashcard does not exist.')
    }
    try{
        const userID = getUserId(req);
        const flashcard = await Flashcard.findOneAndDelete({_id:id , userID: userID })
        if (!flashcard) {
            return res.status(404).json( 'Flashcard does not exist.' )
        }
        res.status(200).json({ message: 'Flashcard deleted successfully.' })

    }catch(error){
        res.status(400).json(error.message);
    }
}

// update flashcards
const updateFlashcard = async (req, res) =>{
    const { id } = req.params
    const updateData = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json( 'Flashcard does not exist.' )
	}

    try {
        const userID = getUserId(req)
        const flashcard = await Flashcard.findOneAndUpdate({ _id: id, userID: userID }, updateData, {new: true});
        res.status(200).json(flashcard);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

// create flashcard set
const createFlashcardSet = async (req, res) =>{
    const { courseID, setName } = req.body;
    try{
        const userID = getUserId(req);
        const flashcardSet = await FlashcardSet.create({courseID, setName, userID});
        res.status(200).json(flashcardSet)
    } catch(error){
        res.status(400).json(error.message);
    }
}

// delete flashcard set
const deleteFlashcardSet = async (req, res) =>{
    const { id } = req.params
    try{
        const userID = getUserId(req);
        const flashcardSet = await FlashcardSet.findOneAndDelete({_id:id , userID: userID })
        if (!flashcardSet) {
            return res.status(404).json( 'Flashcard set does not exist.' )
        }
        res.status(200).json({ message: 'Flashcard set deleted successfully.' })

    }catch(error){
        res.status(400).json(error.message);
    }
}

// update flashcard set
const updateFlashcardSet = async (req, res) =>{
    const { id } = req.params
    const updateData = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json( 'Flashcard set does not exist.' )
	}

    try {
        const userID = getUserId(req)
        const flashcardSet = await FlashcardSet.findOneAndUpdate({ _id: id, userID: userID }, updateData, {new: true});
        res.status(200).json(flashcardSet);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

// get flashcard set
const getFlashcardSet = async (req, res) =>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json( 'Flashcard set does not exist.' )
	}
    try{
        const userID = getUserId(req)
        const cards = await Flashcard.find({setID: id, userID: userID}).collation({locale:'en',strength: 2}).sort({createdAt:1});
        const set = await FlashcardSet.findOne({_id: id, userID: userID}).collation({locale:'en',strength: 2}).sort({setName:1});
        res.status(200).json({cards: cards, set: set});
    } catch (error) {
        res.status(400).json(error.message);
    }
}

// get all flashcards
const getAllFlashcards = async (req, res) => {
    try {
        const userID = getUserId(req)
        const flashcard = await Flashcard.find({userID: userID}).collation({locale:'en',strength: 2}).sort({createdAt:1});
        res.status(200).json(flashcard);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

// get all flashcard sets
const getAllFlashcardSets = async (req, res) =>{
    try{
        const userID = getUserId(req)
        const flashcardSets = await FlashcardSet.find({userID: userID}).collation({locale:'en',strength: 2}).sort({setName:1});
        res.status(200).json(flashcardSets);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = {
    createFlashcard,
    deleteFlashcard,
    updateFlashcard,
    createFlashcardSet,
    deleteFlashcardSet,
    updateFlashcardSet,
    getFlashcardSet,
    getAllFlashcards,
    getAllFlashcardSets
}