import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import NewCard from '@forms/NewCard';
import NewSet from '@forms/NewSet';

function ViewFlashcards(){
    return(
        <>
        <NewCard/>
        <NewSet/>
        </>
    )
}

export function OneSet(){
    const [data, setData] = useState(null);
    const [cards, setCards] = useState(null);
    const [error, setError] = useState(null);
    const {id} = useParams();

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

    if (data===null) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;
    
    // if (cards.length === 0) return <div><a href="/flashcards/cards/new">Create your first card!</a></div>

    return(
        <>
        { cards.map(e=>
            <div className="card" id={e._id}>
                <div className="card_q">{e.question}</div>
                <div className="card_a">{e.answer}</div>
            </div>
            )
        }
        <NewCard setID={data._id}/>
        </>
    )
}

export function OneCard(){
    async function handleChange(e, data) {
        const body = {}
        body[e.target.name] = e.target.value;
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "courses/" + data._id, {
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
}

export default ViewFlashcards;