import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";

function NewCard(){
    const [sets, setSets] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            navigate("/flashcards/cards/" + json["_id"])
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
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(error);
                setLoading(false);
            }
        }
        getSets();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    if (sets.length === 0) return <div><a href="/flashcards/set/new">Create a set first!</a></div>

    const setOptions = [];
    sets.forEach(e=>{
        setOptions.push(<option value={e["_id"]}>{e["setName"]}</option>)
    })
    return(
        <form id='new-flashcard' method='post' onSubmit={handleSubmit}>
            <select name="setID" id="setID">
                {setOptions}
            </select>
            <input type='text' id='question' name='question' placeholder='Flashcard Question'/>
            <input type='text' id='answer' name='answer' placeholder='Flashcard Answer'/>
            <input type="submit" value="Create Flashcard" />
        </form>
    )
}

export default NewCard;