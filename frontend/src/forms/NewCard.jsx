import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";

function NewCard(args){
    const [sets, setSets] = useState(null);
    const [error, setError] = useState(null);

    const { setID } = args
    const hasID = setID!==undefined && setID!==null

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/cards", { 
                method: form.method,
                body: JSON.stringify(formJson), 
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"],
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json()
            if(!hasID) navigate("/flashcards/sets/" + json["setID"])
            window.location.reload()
        } catch (err) {
            console.log(err);
        }
    }

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
                    console.log(response.json());
                    throw new Error(response.statusText);
                }
                setSets(await response.json());
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        if(!hasID) {
            getSets()
        } else {
            setSets(setID)
        }
    }, []);

    if (sets===null) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    if (sets.length === 0) return <div><a href="/flashcards/set/new">Create a set first!</a></div>

    return(
        <details open={args.open}><summary>New Flash Card</summary>
        <form id='new-flashcard' method='post' onSubmit={handleSubmit}>
            {hasID ? <input type='hidden' id='setID' name='setID' value={setID}/> :
                <select name="setID" id="setID">
                    {sets.map(e=> <option value={e["_id"]}>{e["setName"]}</option>) }
                </select>
            }
            <input required type='text' id='question' name='question' placeholder='Flashcard Question'/>
            <input required type='text' id='answer' name='answer' placeholder='Flashcard Answer'/>
            <input type="submit" value="Create Card" />
        </form>
        </details>
    )
}

export default NewCard;