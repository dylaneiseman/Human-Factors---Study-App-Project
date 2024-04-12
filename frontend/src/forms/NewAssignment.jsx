import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function NewAssignment() {
    const defaultDate = new Date().toISOString().split("T")[0];
    const navigate = useNavigate();
    
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        try {
            const response = await fetch('http://localhost:4000/api/assignments/', { 
                method: form.method,
                body: JSON.stringify(formJson), 
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"],
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json()
            navigate("/assignments/" + json["_id"])
        } catch (err) {
            console.log(err);
        }
    }

    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getCourses() {
            try {
                const response = await fetch("http://localhost:4000/api/courses", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    console.log(response.json());
                    throw new Error(response.statusText);
                }
                setCourses(await response.json());
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(error);
                setLoading(false);
            }
        }
        getCourses();
    }, []);

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    if (courses.length === 0) return <div><a href="/courses/new">Create a course first!</a></div>
    
    const courseOptions = [];
    courses.forEach(e=>{
        courseOptions.push(<option value={e["_id"]}>{e["courseName"]}</option>)
    })
    return(
        <form id="new-assignment" method="post" onSubmit={handleSubmit}>
            <select name="courseID" id="courseID">
                {courseOptions}
            </select>
            <input type="text" id="assignmentTitle" name="assignmentTitle" placeholder="Assignment title"/>
            <textarea id="description" name="description" placeholder="Description of assignment"></textarea>
            <input type="date" id="dueDate" name="dueDate" defaultValue={defaultDate}/>
            <input type="submit" value="Create Assignment" />
        </form>
    )
}

export default NewAssignment;