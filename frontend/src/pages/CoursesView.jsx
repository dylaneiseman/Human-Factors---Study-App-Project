import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import NewSet from '@forms/NewSet';
import NewAssignment from '@forms/NewAssignment';
import NewCourse from '@forms/NewCourse';
import Modal from '@components/Modal';
import Loading from '@pages/Loading';

function ViewCourses(){
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null);
    const navigate = useNavigate();
    
    function handleDelete(id, name) {
        setModal(<Modal className="delete-msg">
            <div className="details">Are you sure you want to delete <b>{name}</b>?</div>
            <div className="options">
                <button className="btn-yes" onClick={()=>onDelete(id)}>Yes</button>
                <button className="btn-no" onClick={()=>setModal(null)}>No</button>
            </div>
        </Modal>)
    } 
    async function onDelete(id) {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "courses/" + id, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                }
            });
            if (!response.ok) {
                throw new Error(await response.json());
            }
            window.location.reload();
        } catch (err) {
            setError(err)
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
                const json = await response.json();
                if (!response.ok) {
                    throw new Error(json)
                }
                setData(json);
            } catch (err) {
                setError(err);
            }
        }
        getData();
    }, []);

    if (data === null) return <Loading/>;

    if (error) return <div id="view"><div className="error">Error: {error.message}</div></div>;
    
    if (data.length === 0) return navigate("/courses/new");
    
    function Delete({id, name}) { return (<button className="delete" onClick={()=>handleDelete(id, name)}><i class="fa-solid fa-trash"></i> Delete</button>) }
    return(
        <div id="view">
            {modal}
            {data.map(e=>
                (<div className="entry" id={"course-" + e._id}>
                    <a href={"/courses/" + e._id}>{e.courseName}</a> 
                    <div className="options">
                        <Delete id={e._id} name={e.courseName}/>
                    </div>
                </div>)
            )}
            <NewCourse/>
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
    const [modal, setModal] = useState(null);
    function handleDelete(type, id, name) {
        setModal(<Modal className="delete-msg">
            <div className="details">Are you sure you want to delete <b>{name}</b>?</div>
            <div className="options">
                <button className="btn-yes" onClick={()=>onDelete(type, id)}>Yes</button>
                <button className="btn-no" onClick={()=>setModal(null)}>No</button>
            </div>
        </Modal>)
    } 
    async function onDelete(type, id) {
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + type + "/" + id, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                }
            });
            if (!response.ok) {
                throw new Error(await response.json());
            }
            navigate("/courses")
            window.location.reload();
        } catch (err) {
            setError(err)
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
                const json = await response.json();
                if (!response.ok) {
                    setError(json);
                    return false;
                }
                setAssignments(json);
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        async function getData() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + window.location.pathname.slice(1), {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                const json = await response.json();
                if (!response.ok) 
                    throw new Error(json)
                const {course, sets} = json;
                setData(course);
                setSets(sets);
            } catch (err) {
                setError(err);
                setData("")
            }
        }
        getAssignments();
        getData();
    }, []);

    if (data===null || assignments===null) return <Loading/>;

    if (error) return <div id="view"><div className="error">Error: {error.message}</div></div>;
    
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

    function Delete({type, id, name}) { return (<button className="delete" onClick={()=>handleDelete(type,id,name)}><i class="fa-solid fa-trash"></i> Delete</button>) }
    return(
        <div id="view">
            {modal}

            <form className="details" id="course-details">
                <input type="text" id="courseName" name="courseName" defaultValue={data.courseName} onChange={(e)=>handleChange(e, data)}/>
                <input type="number" id="intensityRank" name="intensityRank" defaultValue={data.intensityRank} step="1" min="1" max="5" onChange={(e)=>handleChange(e, data)}/>
                <Delete type="courses" id={data._id} name={data.courseName}/>
            </form>
            
            <div className="lists" id="assignments-list">
                {assignments.map(e => (e.courseID == id) ?
                    <div className="entry" id={"assign-" + e._id}>
                        <a href={"/assignments/" + e._id}>{e.assignmentTitle}</a> 
                        <div className="options"><Delete id={e._id} type="assignments" name={e._assignmentTitle}/></div>
                    </div> : ""
                )}
            </div>
            <NewAssignment courseID={data._id}/>
            
            <div className="lists" id="flashcards-list">
                {sets.map(e => <div className="entry" id={"set-" + e._id}>
                    <a href={"/flashcards/sets/" + e._id}>{e.setName}</a>
                    <div className="options">
                        <a href={"/flashcards/sets/" + data._id + "/play"} className="play"><i class="fa-solid fa-play"></i> Play</a>
                        <Delete id={e._id} type="flashcards/sets" name={e.setName}/>
                    </div>
                </div>)}
            </div>
            <NewSet courseID={data._id}/>
        </div>
    );
}

export default ViewCourses;