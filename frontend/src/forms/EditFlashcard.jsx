import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from "react-router-dom";

function EditFlashcard(){
    const navigate = useNavigate();
    const id = useParams();
    const [card, setCard] = useState({
        id: "",
        flashcardGroupID: "",
        question: "",
        answer: "",
    });

    const handleChange = (e) => {
        setCard({
            ...card,
            [e.target.name]: e.target.value,
        });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        try {
            await fetch(process.env.REACT_APP_API_URL+'flashcards/'+card.id, { 
                method: "put",
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
    const [loadingGroups, setLoadingGroups] = useState(true);
    const [loadingCard, setLoadingCard] = useState(true);
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
                setLoadingGroups(false);
            } catch (err) {
                console.log(err);
                setError(error);
                setLoadingGroups(false);
            }
        }
        getFlashcardGroups();
    }, []);

    useEffect(() => {
        async function getFlashcard() {
            try {
                // need id.id in request because params is instantiated as an object for some reason
                const response = await fetch(process.env.REACT_APP_API_URL+"flashcards/card/"+id.id, {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    console.log(response.json());
                    throw new Error(response.statusText);
                }
                const json = await response.json()
                setCard({id: json["_id"],flashcardGroupID: json["flashcardGroupID"], question: json["question"], answer: json["answer"]});
                setLoadingCard(false);
            } catch (err) {
                console.log(err);
                setError(error);
                setLoadingCard(false);
            }
        }
        getFlashcard();
    }, []);

    if (loadingGroups||loadingCard) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    if (flashcardGroups.length === 0) return <div><a href="/flashcards/sets/new">Create a flashcard set first!</a></div>
    
    const flashcardGroupOptions = [];
    flashcardGroupOptions.push(<option value={card.flashcardGroupID}>Keep using current group</option>)
    flashcardGroups.forEach(e=>{
        flashcardGroupOptions.push(<option value={e["_id"]}>{e["groupName"]}</option>)
    })

    return(
        <form id = 'put-flashcard' method = 'put' onSubmit = {handleSubmit}>
            <select name="flashcardGroupID" id="flashcardGroupID">
                {flashcardGroupOptions}
            </select>
            <input type = 'text' id = 'question' name = 'question' placeholder = 'Flashcard Question' value = {card.question} onChange = {handleChange}/>
            <input type = 'text' id = 'answer' name = 'answer' placeholder = 'Flashcard Answer' value = {card.answer} onChange = {handleChange}/>
            <input type="submit" value="Update Flashcard" />
        </form>
    )
}

export default EditFlashcard;