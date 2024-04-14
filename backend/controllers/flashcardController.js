const Flashcard = require('../models/flashcardModel')
const FlashcardGroup = require('../models/flashcardGroup')
const mongoose = require('mongoose')
const {getUserId} = require("../helpers/getUserId")

const createFlashcard = async (req, res) =>{
    const {flashcardGroupID, question, answer} = req.body;

    try{
        const userID = getUserId(req);
        const flashCardGroup = await FlashcardGroup.findOne({_id: flashcardGroupID, userID: userID});
        if(!flashCardGroup){
           return res.status(403).json({error: 'Could not add flashcard to group.'})
        }
        const flashcard = await Flashcard.create({flashcardGroupID, question, answer, userID});
        res.status(200).json(flashcard)

    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const deleteFlashcard = async (req, res) =>{
    const {id} = req.params
    try{
        const userID = getUserId(req);
        const flashcard = await Flashcard.findOneAndDelete({_id:id , userID: userID })
        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard does not exist.' })
        }
        res.status(200).json({ message: 'Flashcard deleted successfully.' })

    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const updateFlashcard = async (req, res) =>{
    const { id } = req.params
    const updateData = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'Flashcard does not exist.' })
	}

    try {
        const userID = getUserId(req)
        const flashcard = await Flashcard.findOneAndUpdate({ _id: id, userID: userID }, updateData, {new: true});
        res.status(200).json(flashcard);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const createFlashcardGroup = async (req, res) =>{
    const {groupName} = req.body;
    try{
        const userID = getUserId(req);
        const flashcardGroup = await FlashcardGroup.create({groupName, userID});
        res.status(200).json(flashcardGroup)

    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const deleteFlashcardGroup = async (req, res) =>{
    const {id} = req.params
    try{
        const userID = getUserId(req);
        const flashcardGroup = await FlashcardGroup.findOneAndDelete({_id:id , userID: userID })
        if (!flashcardGroup) {
            return res.status(404).json({ error: 'Flashcard group does not exist.' })
        }
        res.status(200).json({ message: 'Flashcard group deleted successfully.' })

    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const updateFlashcardGroup = async (req, res) =>{
    const { id } = req.params
    const updateData = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ error: 'Flashcard group does not exist.' })
	}

    try {
        const userID = getUserId(req)
        const flashcardGroup = await FlashcardGroup.findOneAndUpdate({ _id: id, userID: userID }, updateData, {new: true});
        res.status(200).json(flashcardGroup);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getFlashcardsFromGroup = async (req, res) =>{
    const {id} = req.params

    try{
        if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({error: 'The flashcard group does not exist.'})
		}
        const userID = getUserId(req)
        const flashcards = await Flashcard.find({flashcardGroupID: id, userID: userID}).sort({createdAt:-1});
        res.status(200).json(flashcards);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getFlashcardGroupsFromUser = async (req, res) =>{
    try{
        const userID = getUserId(req)
        const flashcardGroups = await FlashcardGroup.find({userID: userID}).sort({createdAt:-1});
        res.status(200).json(flashcardGroups);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getFlashcard = async(req, res) => {
    const {id} = req.params
    try{
        if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({error: 'The flashcard does not exist.'})
		}
        const userID = getUserId(req)
        const flashcard = await Flashcard.findOne({_id: id, userID: userID});
        res.status(200).json(flashcard);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const getFlashcardGroup = async(req, res) => {
    const {id} = req.params
    try{
        if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({error: 'The flashcard group does not exist.'})
		}
        const userID = getUserId(req)
        const flashcardGroup = await FlashcardGroup.findOne({_id: id, userID: userID});
        res.status(200).json(flashcardGroup);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
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
}