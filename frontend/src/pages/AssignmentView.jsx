import NewAssignment from '@forms/NewAssignment';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

function ViewAssignments(){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [courses, setCourses] = useState(null);

    const navigate = useNavigate();
    async function handleDelete(id) {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "assignments/" + id, {
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
                const courseOptions = [];
                json.forEach(e=>{
                    courseOptions.push(<option value={e._id}>{e.courseName}</option>)
                })
                setCourses(courseOptions);
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        getCourses();
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
                setData(await response.json());
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        getData();
    }, []);

    if (data===null || courses===null) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;
    
    if (data.length === 0) return <div><a href="/assignments/new">Create your first assignment!</a></div>

    async function handleCompleted(data) {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "assignments/" + data._id, {
                method: "put",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                },
                body: JSON.stringify({"completed": data.completed ? false : true})
            });
            if (!response.ok) {
                throw new Error(response.statusText);
            }
        } catch (err) {
            console.log(err);
        }
    }

    async function handleChange(e, data) {
        const body = {}
        body[e.target.name] = e.target.value;
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "assignments/" + data._id, {
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

    function Delete({id}) { return (<button onClick={()=>handleDelete(id)}>delete?</button>) }
    const dataView = []
    if (Array.isArray(data)) { 
        for (const course of courses) {
            const assign = [];
            for (const e of data) {
                if (course.props.value != e.courseID) continue;
                assign.push(
                    <li id={e._id}>
                        <a href={"/assignments/" + e._id}>{e.assignmentTitle}</a>
                        <input type="checkbox" id="completed" name="completed" defaultChecked={e.completed} onChange={()=>handleCompleted(e)}/>
                        <Delete id={e._id}/>
                    </li>
                )
            }
            if (assign.length === 0) continue;
            dataView.push(<div className="course" id={course.props.value}>
                <a href={"/courses/"+course.props.value}>{course.props.children}</a>
                {assign}
            </div>);
        }
        dataView.push(<NewAssignment/>)
    } else {
        dataView.push(<>
        <a href="/assignments">All Assignments</a>
            <select name="courseID" id="courseID" defaultValue={data.courseID} onChange={(e)=>handleChange(e, data)}>
                {courses}
            </select>

            <input type="text" name="assignmentTitle" id="assignmentTitle" defaultValue={data.assignmentTitle} onChange={(e)=>handleChange(e, data)}/>
            <input type="checkbox" id="completed" name="completed" defaultChecked={data.completed} onChange={()=>handleCompleted(data)}/>
            <textarea id="description" name="description" defaultValue={data.description} onChange={(e)=>handleChange(e, data)}></textarea>
            <input type="date" id="dueDate" name="dueDate" defaultValue={data.dueDate.split("T")[0]} onChange={(e)=>handleChange(e, data)}/>
            <Delete id={data._id}/>
        </>);
    }

    return(
        <div id="assignment-view">
            {dataView}
        </div>
    );
}

export default ViewAssignments;