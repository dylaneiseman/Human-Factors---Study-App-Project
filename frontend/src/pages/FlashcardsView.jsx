import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import NewCard from '@forms/NewCard';
import NewSet from '@forms/NewSet';

function ViewFlashcards(){
    const [sets, setSets] = useState(null);
    const [cards, setCards] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        async function getSets() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/sets", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const json = await response.json();
                setSets(json);
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        async function getCards() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/cards", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const json = await response.json();
                setCards(json);
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        getSets();
        getCards();
    }, []);

    if (sets===null || cards===null) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (sets.length === 0) return <div><a href="/flashcards/sets/new">Create your first set!</a></div>

    return(
        <>
        {sets.map(set => 
            <div className="set" id={"set-" + set._id}>
                <a href={"/flashcards/sets/" + set._id}>{set.setName}</a>
                {cards.map(card=> 
                    set._id===card.setID ? 
                    <div className="card" id={"card-" + card._id}>
                        <div className="card_q">{card.question}</div>
                        <div className="card_a">{card.answer}</div>
                    </div> 
                    : ""
                )}
            </div>)
        }
            <NewCard/>
            <NewSet/>
        </>
    )
}

export function OneSet(){
    const [data, setData] = useState(null);
    const [cards, setCards] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate()

    async function handleDelete(type, id) {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/" + type + "/" + id, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            if (type=="sets") navigate("/flashcards/sets")
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + window.location.pathname.slice(1), {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const {set, cards} = await response.json();
                setData(set);
                setCards(cards);
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        getData();
    }, []);

    async function handleChange(e, type, id) {
        const body = {}
        body[e.target.name] = e.target.value;
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/" + type + "/" + id, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        } catch (err) {
            console.log(err);
        }
    }

    if (data===null || cards===null) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;
    
    // if (cards.length === 0) return <div><a href="/flashcards/cards/new">Create your first card!</a></div>

    return(
        <>
        <a href="/flashcards/sets/">All sets</a>
        <input type="text" name="setName" id="setName" defaultValue={data.setName} onChange={(e)=>handleChange(e, "sets", e._id)}/> <button onClick={()=>handleDelete("sets", data._id)}>delete?</button>
        { cards.map(e=>
            <div className="card" id={e._id}>
                <input className="card_q" name="question" id="question" defaultValue={e.question} onChange={($this)=>handleChange($this, "cards", e._id)}/>
                <input className="card_a" name="answer" id="answer" defaultValue={e.answer} onChange={($this)=>handleChange($this, "cards", e._id)}/>
                <button onClick={()=>handleDelete("cards", e._id)}>delete?</button>
            </div>
            )
        }
        <NewCard setID={data._id}/>
        </>
    )
}

export default ViewFlashcards;