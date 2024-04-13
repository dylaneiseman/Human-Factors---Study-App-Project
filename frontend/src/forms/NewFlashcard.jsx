import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

function NewFlashcard(){
    const nagigate = useNavigate();

    const handleSubmit = (e) =>{
        e.preventDefault();
        const form = e.target;
        try{

        }catch(error){
            console.log(error);
        }
    }

    return(
        <form id = 'new-flashcard' method = 'post' onSubmit = {handleSubmit}>
            <input type = 'text' id = 'question' name = 'question' placeholder = 'Flashcard Question'/>
            <input type = 'text' id = 'answer' name = 'answer' placeholder = 'Flashcard Answer'/>
            <input type="submit" value="Create Flashcard" />
        </form>
    )
}

export default NewFlashcard;