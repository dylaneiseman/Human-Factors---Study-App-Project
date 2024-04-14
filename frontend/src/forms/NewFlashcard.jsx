import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";

function NewFlashcard(){
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(process.env.REACT_APP_API_URL+'flashcards', { 
                method: form.method,
                body: JSON.stringify(formJson), 
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"],
                    "Content-Type": "application/json"
                }
            });
            navigate("/flashcards")
        } catch (err) {
            console.log(err);
        }
    }

    const [flashcardGroups, setFlashcardGroups] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getFlashcardGroups() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL+"flashcards", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    console.log(response.json());
                    throw new Error(response.statusText);
                }
                setFlashcardGroups(await response.json());
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(error);
                setLoading(false);
            }
        }
        getFlashcardGroups();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    if (flashcardGroups.length === 0) return <div><a href="/flashcards/sets/new">Create a flashcard set first!</a></div>
    
    const flashcardGroupOptions = [];
    flashcardGroups.forEach(e=>{
        flashcardGroupOptions.push(<option value={e["_id"]}>{e["groupName"]}</option>)
    })

    return(
        <form id = 'new-flashcard' method = 'post' onSubmit = {handleSubmit}>
            <select name="flashcardGroupID" id="flashcardGroupID">
                {flashcardGroupOptions}
            </select>
            <input type = 'text' id = 'question' name = 'question' placeholder = 'Flashcard Question'/>
            <input type = 'text' id = 'answer' name = 'answer' placeholder = 'Flashcard Answer'/>
            <input type="submit" value="Create Flashcard" />
        </form>
    )
}

export default NewFlashcard;