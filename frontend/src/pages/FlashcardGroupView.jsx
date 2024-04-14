import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function ViewFlashcardGroups(){
    const [groups, setGroups] = useState(null);
    const [error, setError] = useState(null);

    useEffect(()=>{
        async function getGroups(){
            try{
                const response = await fetch(process.env.REACT_APP_API_URL+"flashcards", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const json = await response.json();
                const groupElements = [];
                json.forEach(e=>{
                    groupElements.push(
                        <li id={e._id}>
                            <a href={"/flashcards/sets/" + e._id}>{e.groupName}</a>
                        </li>
                    )
                });
                setGroups(groupElements);
            }catch(error){
                console.log(error);
                setError(error);
            }
        }
        getGroups();
    }, []);

    if (groups === null) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;
    
    if (groups.length === 0) return <div><a href="/flashcards/sets/new">Create your first flashcard set!</a></div>

    return(
        <div id = "flashcard-group-view">
            <div id = "add-new-set">
                <a href="/flashcards/sets/new">Add New Set</a>
            </div>
            <label>Your Flashcard Sets:</label>
            {groups}
        </div>
    )
}

export function OneGroup(){
    const [cardList, setCardList] = useState(null);
    const [currentCard, setCurrentCard] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [showQuestion, setShowQuestion] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [cardConfirm, setCardConfirm] = useState(null);
    const [groupConfirm, setGroupConfirm] = useState(null);
    const [error, setError] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect( () => {
        async function GetCards(){
            try{
                console.log(id)
                const response = await fetch(process.env.REACT_APP_API_URL+"flashcards/"+id, {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const json = await response.json();
                const cards = [];
                for(const e of json){
                    if (e.flashcardGroupID !== id) continue;
                    cards.push({id: e._id, question: e.question, answer: e.answer});
                }
                setCardList(cards);
                if(cards.length>0){
                    setDisplayedText(cards[currentCard].question);
                }
            }catch(error){
                console.log(error);
                setError(error);
            }
        }
        GetCards();
    }, []);

    if (cardList===null) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;
    
    if (cardList.length === 0) return <div><a href="/flashcards/cards/new">Create your first flashcard!</a></div>

    function UpdateText(index){
        if(showQuestion===1){
            setDisplayedText(cardList[index].question);
        }else{
            setDisplayedText(cardList[index].answer);
        }
    }

    const FlipCard = () =>{
        if(showQuestion===1){
            setShowQuestion(0);
        }else{
            setShowQuestion(1);
        }
        UpdateText(currentCard);
    }

    const PrevCard = () =>{
        if(currentCard-1<0){
            setErrorMessage("There are no previous cards.");
        }else{
            setErrorMessage("");
            setShowQuestion(1);
            UpdateText(currentCard-1);
            setCurrentCard(currentCard=>currentCard-1);
        }
    }

    const NextCard = () =>{
        if(currentCard+1>=cardList.length){
            setErrorMessage("There are no cards next.");
        }else{
            setErrorMessage("");
            setShowQuestion(1);
            UpdateText(currentCard+1);
            setCurrentCard(currentCard=>currentCard+1);
        }
    }

    const HideCardConfirm = () =>{
        setCardConfirm(null);
    }

    async function DeleteFlashcard(){
        try{
            await fetch(process.env.REACT_APP_API_URL+"flashcards/"+cardList[currentCard].id, {
                method: "delete",
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                }
            });
        }catch(error){
            console.log(error);
            setError(error);
        }
        window.location.reload();
    }

    const CreateCardConfirm = () =>{
        const confirmMenu =
            <div>
                <label>Are you sure you want to delete this card?</label>
                <div>
                    <button id = "yes" onClick = {DeleteFlashcard}>Yes</button>
                    <button id = "no" onClick = {HideCardConfirm}>No</button>
                </div>
            </div>
        setCardConfirm(confirmMenu);
    }

    const HideGroupConfirm = () =>{
        setGroupConfirm(null);
    }

    async function DeleteGroup(){
        try{
            await fetch(process.env.REACT_APP_API_URL+"flashcards/group/"+id, {
                method: "delete",
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                }
            });
        }catch(error){
            console.log(error);
            setError(error);
        }
        navigate("/flashcards");
    }

    const CreateGroupConfirm = () =>{
        const confirmMenu =
            <div>
                <label>Are you sure you want to delete this flashcard set?</label>
                <div>
                    <button id = "yes" onClick = {DeleteGroup}>Yes</button>
                    <button id = "no" onClick = {HideGroupConfirm}>No</button>
                </div>
            </div>
        setGroupConfirm(confirmMenu);
    }

    return(
        <div id = "card-set-view">
            <div id = "rename-group"><a href = {"/flashcards/sets/edit/"+id}>Rename Flashcard Set</a></div>
            <div id = "delete-group">
                <button onClick = {CreateGroupConfirm}>Delete Flashcard Set</button>
                <div id = "group-confirm" name = "confirm">
                    {groupConfirm}
                </div>
            </div>
            <div id = "flashcard-display-text">
                {displayedText}
            </div>
            <div id = "control-buttons">
                <button id = "previous" onClick = {PrevCard}>Previous</button>
                <button id = "flip-card" onClick = {FlipCard}>Flip Card</button>
                <button id = "next" onClick = {NextCard}>Next</button>
            </div>
            <div id = "card-counter">
                Card {currentCard+1} of {cardList.length}
            </div>
            <div id = "display-error-message">
                {errorMessage}
            </div>
            <div id = "create-flashcard">
                <a href = "/flashcards/cards/new">Add New Card to Flashcard Set</a>
            </div>
            <div id = "edit-flashacrd">
                <a href = {"/flashcards/cards/edit/"+cardList[currentCard].id}>Edit This Card</a>
            </div>
            <div id = "delete-flashcard">
                <button id = "delete-card" onClick = {CreateCardConfirm}>Delete This Card</button>
                <div id = "card-confirm" name = "confirm">
                    {cardConfirm}
                </div>
            </div>
            
        </div>
    )
}

export default ViewFlashcardGroups