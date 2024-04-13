import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

function NewFlashcardSet(){
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
        <form id='new-flashcard-set' method='post' onSubmit={handleSubmit}>
            <input type='text' id='name' name='name' placeholder='Name of set'/>
            <input type="submit" value="Create Flashcard" />
        </form>
    )
}

export default NewFlashcardSet;