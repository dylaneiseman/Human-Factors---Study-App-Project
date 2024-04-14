import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

function NewFlashcardGroup(){
    const navigate = useNavigate();

    async function handleSubmit(e){
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        try{
            const response = await fetch(process.env.REACT_APP_API_URL+'flashcards/group/', { 
                method: form.method,
                body: JSON.stringify(formJson), 
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"],
                    "Content-Type": "application/json"
                }
            });
            navigate("/flashcards")
        }catch(error){
            console.log(error);
        }
    }

    return(
        <form id = 'new-flashcard-group' method = 'post' onSubmit = {handleSubmit}>
            <input type = 'text' id = 'groupName' name = 'groupName' placeholder = 'Flashcard Group Name'/>
            <input type="submit" value="Create Flashcard Group" />
        </form>
    )
}

export default NewFlashcardGroup;