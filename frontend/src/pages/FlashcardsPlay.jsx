import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Play(){
    const [cardList, setCardList] = useState(null);
    const [currentCard, setCurrentCard] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [showQuestion, setShowQuestion] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    // const [cardConfirm, setCardConfirm] = useState(null);
    // const [groupConfirm, setGroupConfirm] = useState(null);
    const [error, setError] = useState(null);
    const {id} = useParams();
    // const navigate = useNavigate();

    useEffect( () => {
        async function GetCards(){
            try{
                const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/sets/" + id, {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const { cards } = await response.json();
                setCardList(cards);
                if(cards.length>0){
                    setDisplayedText(cards[currentCard].question);
                }
            } catch(error) {
                console.log(error);
                setError(error);
            }
        }
        GetCards();
    }, []);

    if (cardList===null) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;
    
    if (cardList.length === 0) return <div><a href={"/flashcards/sets/" + id}>Create your first flashcard!</a></div>

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

    // const HideCardConfirm = () =>{
    //     setCardConfirm(null);
    // }

    // async function DeleteFlashcard(){
    //     try{
    //         await fetch(process.env.REACT_APP_API_URL+"flashcards/"+cardList[currentCard].id, {
    //             method: "delete",
    //             headers: {
    //                 "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
    //             }
    //         });
    //     }catch(error){
    //         console.log(error);
    //         setError(error);
    //     }
    //     window.location.reload();
    // }

    // const CreateCardConfirm = () =>{
    //     const confirmMenu =
    //         <div>
    //             <label>Are you sure you want to delete this card?</label>
    //             <div>
    //                 <button id = "yes" onClick = {DeleteFlashcard}>Yes</button>
    //                 <button id = "no" onClick = {HideCardConfirm}>No</button>
    //             </div>
    //         </div>
    //     setCardConfirm(confirmMenu);
    // }

    // const HideGroupConfirm = () =>{
    //     setGroupConfirm(null);
    // }

    // async function DeleteGroup(){
    //     try{
    //         await fetch(process.env.REACT_APP_API_URL+"flashcards/group/"+id, {
    //             method: "delete",
    //             headers: {
    //                 "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
    //             }
    //         });
    //     }catch(error){
    //         console.log(error);
    //         setError(error);
    //     }
    //     navigate("/flashcards");
    // }

    // const CreateGroupConfirm = () =>{
    //     const confirmMenu =
    //         <div>
    //             <label>Are you sure you want to delete this flashcard set?</label>
    //             <div>
    //                 <button id = "yes" onClick = {DeleteGroup}>Yes</button>
    //                 <button id = "no" onClick = {HideGroupConfirm}>No</button>
    //             </div>
    //         </div>
    //     setGroupConfirm(confirmMenu);
    // }

    return(
        <div id="card-set-view">
            <div id="flashcard-display-text">
                {displayedText}
            </div>
            <div id="control-buttons">
                <button id="previous" onClick = {PrevCard}>Previous</button>
                <button id="flip" onClick = {FlipCard}>Flip Card</button>
                <button id="next" onClick = {NextCard}>Next</button>
            </div>
            <div id="card-counter">
                Card {currentCard+1} of {cardList.length}
            </div>
            <div className="error">
                {errorMessage}
            </div>
        </div>
    )
}

export default Play