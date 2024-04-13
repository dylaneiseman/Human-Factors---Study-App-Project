import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";

function NewSet(){
    const [courses, setCourses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/sets", { 
                method: form.method,
                body: JSON.stringify(formJson), 
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"],
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json()
            navigate("/flashcards/sets/" + json["_id"])
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
        <form id='new-flashcard-set' method='post' onSubmit={handleSubmit}>
            <select name="courseID" id="courseID">
                {courseOptions}
            </select>
            <input type='text' id='setName' name='setName' placeholder='Name of set'/>
            <input type="submit" value="Create Flashcard" />
        </form>
    )
}

export default NewSet;