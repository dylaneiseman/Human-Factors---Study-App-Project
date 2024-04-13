import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ViewCourses(){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

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
                const dataView = []
                json.forEach(e=>{
                    dataView.push(
                        <li id={e._id}>
                            <a href={"/courses/" + e._id}>{e.courseName}</a>
                        </li>
                    )
                })
                setData(dataView);
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

    return(
        <div id="course-view">
            {data}
        </div>
    );
}

export function OneCourse() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [assignments, setAssignments] = useState(null);
    const {id} = useParams();

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
                const assignmentOptions = [];
                for(const e of json){
                    if (e.courseID != id) continue;
                    assignmentOptions.push(<li><a href={"/assignments/" + e._id}>{e.assignmentTitle}</a></li>)
                }
                setAssignments(assignmentOptions);
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
                const response = await fetch(process.env.REACT_APP_API_URL + window.location.pathname, {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                setData(await response.json());
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

    return(
        <div id="course-view">
            <a href="/courses">All Courses</a>
            <input type="text" id="courseName" name="courseName" defaultValue={data.courseName} onChange={(e)=>handleChange(e, data)}/>
            <input type="number" id="intensityRank" name="intensityRank" defaultValue={data.intensityRank} step="1" min="1" max="5" onChange={(e)=>handleChange(e, data)}/>
            <ul>
                {assignments}
            </ul>
        </div>
    );
}

export default ViewCourses;