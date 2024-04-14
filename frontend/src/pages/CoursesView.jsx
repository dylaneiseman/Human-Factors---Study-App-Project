import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import NewSet from '@forms/NewSet';
import NewAssignment from '@forms/NewAssignment';

function ViewCourses(){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    async function handleDelete(id) {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "courses/" + id, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "courses", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const json = await response.json();
                setData(json);
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        getData();
    }, []);

    if (data === null) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;
    
    if (data.length === 0) return <div><a href="/courses/new">Create your first course!</a></div>

    function Delete({id}) { return (<button onClick={()=>handleDelete(id)}>delete?</button>) }
    return(
        <div id="course-view">
            {data.map(e=>
                (<li id={e._id}>
                    <a href={"/courses/" + e._id}>{e.courseName}</a> 
                    <Delete id={e._id}/>
                </li>)
            )}
        </div>
    );
}

export function OneCourse() {
    const [data, setData] = useState(null);
    const [sets, setSets] = useState(null);
    const [error, setError] = useState(null);
    const [assignments, setAssignments] = useState(null);
    const {id} = useParams();

    const navigate = useNavigate();
    async function handleDelete(type, id) {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + type + "/" + id, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                }
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            navigate("/courses")
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        async function getAssignments() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "assignments", {
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
                setAssignments(json);
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        getAssignments();
    }, []);
    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + window.location.pathname.slice(1), {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const {course, sets} = await response.json();
                setData(course);
                setSets(sets);
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        getData();
    }, []);

    if (data===null || assignments===null) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;
    
    if (data.length === 0) return <div><a href="/courses/new">Create your first course!</a></div>

    async function handleChange(e, data) {
        const body = {}
        body[e.target.name] = e.target.value;
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "courses/" + data._id, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        } catch (err) {
            console.log(err);
        }
    }

    function Delete({type, id}) { return (<button onClick={()=>handleDelete(type,id)}>delete?</button>) }
    return(
        <div id="course-view">
            <a href="/courses">All Courses</a>

            <input type="text" id="courseName" name="courseName" defaultValue={data.courseName} onChange={(e)=>handleChange(e, data)}/>
            <input type="number" id="intensityRank" name="intensityRank" defaultValue={data.intensityRank} step="1" min="1" max="5" onChange={(e)=>handleChange(e, data)}/>
            <Delete type="courses" id={data._id}/>
            
            <ul>
                {assignments.map(e => (e.courseID == id) ?
                    <li><a href={"/assignments/" + e._id}>{e.assignmentTitle}</a> <Delete id={e._id} type="assignments"/></li> : ""
                )}
            </ul>
            <NewAssignment courseID={data._id}/>
            
            <ul>
                {sets.map(e => <li><a href={"/flashcards/sets/" + e._id}>{e.setName}</a> <Delete id={e._id} type="flashcards/sets"/></li>)}
            </ul>
            <NewSet courseID={data._id}/>
        </div>
    );
}

export default ViewCourses;