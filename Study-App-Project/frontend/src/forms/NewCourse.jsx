import React, {useState} from 'react';
import { useNavigate } from "react-router-dom";

function NewCourse() {
    const navigate = useNavigate();
    
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        try {
            const response = await fetch('http://localhost:4000/api/courses/', { 
                method: form.method,
                body: JSON.stringify(formJson), 
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"],
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json()
            navigate("/courses/" + json["_id"])
        } catch (err) {
            console.log(err);
        }
    }

    //courseID, courseName, courseTime, intensityRank
    return(
        <form id="new-course" method="post" onSubmit={handleSubmit}>
            <input type="text" id="courseName" name="courseName" placeholder="Course title"/>
            <input type="number" id="intensityRank" name="intensityRank" placeholder="1" step="1" min="1" max="5"/>
            <input type="submit" value="Create Course" />
        </form>
    )
}

export default NewCourse;