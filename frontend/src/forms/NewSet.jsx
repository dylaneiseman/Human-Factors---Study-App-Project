import React, {useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import Loading from '@pages/Loading';

function NewSet(args){
    const [courses, setCourses] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const { courseID } = args
    const hasID = courseID!==undefined && courseID!==null

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
            if(!hasID) navigate("/flashcards/sets/" + json["_id"])
            window.location.reload()
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
                const json = await response.json();
                setCourses(json);
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        if(!hasID) {
            getCourses()
        } else {
            setCourses(courseID)
        };
    }, []);

    if (courses===null) return <Loading/>;

    if (error) return <div>Error: {error.message}</div>;

    if (courses.length === 0) return <div><a href="/courses/new">Create a course first!</a></div>

    return(
        <details open={args.open}><summary>New Set</summary>
        <form id='new-flashcard-set' method='post' onSubmit={handleSubmit}>
            {hasID ? <input type="hidden" id="courseID" name="courseID" value={courses}/> :
                <select name="courseID" id="courseID">
                    {courses.map(e => <option value={e["_id"]}>{e["courseName"]}</option> )}
                </select>
            }
            <input required type='text' id='setName' name='setName' placeholder='Set name'/>
            <input required type="submit" value="Create Flashcard Set" />
        </form>
        </details>
    )
}

export default NewSet;