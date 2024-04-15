import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import NewCard from '@forms/NewCard';
import Loading from '@pages/Loading';

import "@css/pages/Play.scss"

function Play(){
    const [set, setSet] = useState(null);
    const [cardList, setCardList] = useState(null);
    const [currentCard, setCurrentCard] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [showQuestion, setShowQuestion] = useState(true);
    // const [errorMessage, setErrorMessage] = useState("");
    // const [cardConfirm, setCardConfirm] = useState(null);
    // const [groupConfirm, setGroupConfirm] = useState(null);
    const [error, setError] = useState(null);
    const {id} = useParams();
    const navigate = useNavigate();
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
                const { cards, set } = await response.json();
                setCardList(cards);
                setSet(set);
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

    if (cardList===null) return <Loading/>;

    if (error) return <div>Error: {error.message}</div>;
    
    if (cardList.length === 0) return (
        <div id="view">
            <div className="error">Please create flash cards for this set first</div>
        <NewCard setID={set._id}/>
        </div>
        
    )

    const UpdateText = (index, f = showQuestion) => {
        const face = f ? "question" : "answer"
        setDisplayedText(cardList[index][face]);
    }

    
    const FlipCard = () =>{
        UpdateText(currentCard, !showQuestion);
        setShowQuestion(showQuestion => !showQuestion);
    }

    const PrevCard = () =>{
        if(currentCard-1<0){
            UpdateText(cardList.length-1, true);
            setCurrentCard(cardList.length-1);
        }else{
            UpdateText(currentCard-1, true);
            setCurrentCard(currentCard=>currentCard-1);
        }
        setShowQuestion(true);
    }

    const NextCard = () =>{
        if(currentCard+1>=cardList.length){
            UpdateText(0, true);
            setCurrentCard(0);
        }else{
            UpdateText(currentCard+1, true);
            setCurrentCard(currentCard=>currentCard+1);
        }
        setShowQuestion(true);
    }

    function shuffle(array) {
        let currentIndex = array.length;
      
        // While there remain elements to shuffle...
        while (currentIndex != 0) {
      
          // Pick a remaining element...
          let randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
      }

    const ShuffleDeck = (deck) => {
        setCardList(shuffle(deck));
        setDisplayedText(cardList[0].question);
        setCurrentCard(0)
    }

    return(
        <div className="flashcard-play" id="view">
            <div className="details" id="flashcard-display-text">
                {displayedText}
            </div>
            <div className="entry">
                <div className="options" id="control-buttons">
                    <button id="previous" onClick={PrevCard}>Previous</button>
                    <button id="flip" onClick={FlipCard}>Flip Card</button>
                    <button id="next" onClick={NextCard}>Next</button>
                </div>
                <div className="options" id="card-counter">
                    <button id="back"><a href={"/flashcards/sets/" + set._id}>Back</a></button>
                    <button id="current-num">Card {currentCard+1}/{cardList.length}</button>
                    <button id="shuffle" onClick={()=>ShuffleDeck(cardList)}>Shuffle Deck</button>
                </div>
            </div>
            <a href={"/flashcards/sets/" +  set._id} className="end">{set.setName}</a>
        </div>
    )
}

export default Play