import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function NewAssignment(args) {
    const defaultDate = new Date().toISOString().split("T")[0];
    const navigate = useNavigate();

    const [courses, setCourses] = useState(null);
    const [error, setError] = useState(null);

    const { courseID } = args
    const hasID = courseID!==undefined && courseID!==null
    
    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'assignments/', { 
                method: form.method,
                body: JSON.stringify(formJson), 
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"],
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json()
            if(!hasID) navigate("/assignments/" + json["_id"])
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        async function getCourses() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "courses", {
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
                setCourses(json);
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        if(!hasID) {
            getCourses();
        } else {
            setCourses(courseID)
        }
    }, []);

    if (courses===null) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    if (courses.length === 0) return <div><a href="/courses/new">Create a course first!</a></div>
    
    return(
        <form id="new-assignment" method="post" onSubmit={handleSubmit}>
            {hasID ? <input type="hidden" id="courseID" name="courseID" value={courses}/> : <select name="courseID" id="courseID">
                {courses.map(e=>
                    <option value={e["_id"]}>{e["courseName"]}</option>
                )}
            </select>}
            <input type="text" id="assignmentTitle" name="assignmentTitle" placeholder="Assignment title"/>
            <textarea id="description" name="description" placeholder="Description of assignment"></textarea>
            <input type="date" id="dueDate" name="dueDate" defaultValue={defaultDate}/>
            <input type="submit" value="Create Assignment" />
        </form>
    )
}

export default NewAssignment;