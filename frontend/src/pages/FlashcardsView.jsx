import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import NewCard from '@forms/NewCard';
import NewSet from '@forms/NewSet';
import Modal from '@components/Modal';
import Loading from '@pages/Loading';

function ViewFlashcards(){
    const [sets, setSets] = useState(null);
    const [courses, setCourses] = useState(null);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null);

    const navigate = useNavigate()

    //<div>
    //             <label>Are you sure you want to delete this flashcard set?</label>
    //             <div>
    //                 <button id = "yes" onClick = {DeleteGroup}>Yes</button>
    //                 <button id = "no" onClick = {HideGroupConfirm}>No</button>
    //             </div>
    //         </div>

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
            const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/" + type + "/" + id, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                }
            });
            if (!response.ok) {
                throw new Error(await response.json());
            }
            if (type=="sets") navigate("/flashcards/sets")
            window.location.reload();
        } catch (err) {
            setError(err)
        }
    }
    
    useEffect(() => {
        async function getSets() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/sets", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(await response.json());
                }
                const json = await response.json();
                setSets(json);
            } catch (err) {
                setError(err);
                setSets(err);
            }
        }
        async function getCourses() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "courses", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    throw new Error(await response.json());
                }
                const json = await response.json();
                setCourses(json);
            } catch (err) {
                setError(err);
                setCourses(err);
            }
        }
        getSets();
        getCourses();
    }, []);

    if (sets===null || courses===null) return <Loading/>;
    if (error) return <div id="view"><div className="error">Error: {error.message}</div></div>
    if (sets.length === 0) return navigate("/flashcards/sets/new")

    function Delete({type, id, name}) { return (<button className="delete" onClick={()=>handleDelete(type, id, name)}><i class="fa-solid fa-trash"></i> Delete</button>) }
    const dataView = []
    for (const course of courses) {
        const assign = [];
        for (const e of sets) {
            if (course._id != e.courseID) continue;
            assign.push(
                <div className="options" id={e._id}>
                    <a href={"/flashcards/sets/" + e._id}>{e.setName}</a>
                    <a href={"/flashcards/sets/" + e._id + "/play"} className="play"><i class="fa-solid fa-play"></i> Play</a>
                    <Delete type="sets" id={e._id} name={e.setName}/>
                </div>
            )
        }
        if (assign.length === 0) continue;
        dataView.push(<div className="entry course" id={course._id}>
            <a href={"/courses/"+course._id}>{course.courseName}</a>
            {assign}
        </div>);
    }

    return(
        <div id="view">
        {dataView}
            {/* <NewCard/> */}
            <NewSet/>
        {modal}
        </div>
    )
}

export function OneSet(){
    const [data, setData] = useState(null);
    const [cards, setCards] = useState(null);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(null);
    const navigate = useNavigate()

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
            const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/" + type + "/" + id, {
                method: "delete",
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                }
            });
            if (!response.ok) {
                throw new Error(await response.json());
            }
            if (type=="sets") navigate("/flashcards/sets")
            window.location.reload();
        } catch (err) {
            setError(err)
        }
    }

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
                    throw new Error(await response.json());
                }
                const {set, cards} = await response.json();
                setData(set);
                setCards(cards);
            } catch (err) {
                setError(err);
                setData(err);
                setCards(err);
            }
        }
        getData();
    }, []);

    async function handleChange(e, type, id) {
        const body = {}
        body[e.target.name] = e.target.value;
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + "flashcards/" + type + "/" + id, {
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
            setError(error)
        }
    }

    if (data===null || cards===null) return <Loading/>;

    if (error) return <div id="view"><div className="error">Error: {error.message}</div></div>;
    
    // if (cards.length === 0) return <div><a href="/flashcards/cards/new">Create your first card!</a></div>

    function Delete({type, id, name}) { return (<button className="delete" onClick={()=>handleDelete(type, id, name)}><i class="fa-solid fa-trash"></i> Delete</button>) }
    return(
        <div id="view">
            <div className="details">
                <input type="text" name="setName" id="setName" defaultValue={data.setName} onChange={(e)=>handleChange(e, "sets", e._id)}/>
                <a href={"/flashcards/sets/" + data._id + "/play"} className="play"><i class="fa-solid fa-play"></i> Play</a>
                <button className="delete" onClick={()=>handleDelete("sets", data._id)}><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
            
            { cards.map(e=>
                <div className="entry card" id={e._id}>
                    <input className="card_q" name="question" id="question" defaultValue={e.question} onChange={($this)=>handleChange($this, "cards", e._id)}/>
                    <input className="card_a" name="answer" id="answer" defaultValue={e.answer} onChange={($this)=>handleChange($this, "cards", e._id)}/>
                    <Delete id={e._id} type="cards" name="this card"/>
                </div>
                )
            }
            
            <NewCard setID={data._id}/>
            {modal}
        </div>
    )
}

export default ViewFlashcards;