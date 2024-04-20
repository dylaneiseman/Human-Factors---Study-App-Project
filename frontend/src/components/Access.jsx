import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom'

import Modal from "@components/Modal";

import Login from "@forms/Login";
import Signup from "@forms/Signup";
import Loading from '@pages/Loading';

function Access(){
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [err, setErr] = useState(null);
    
    useEffect(() => {
        async function Authenticate() {
            try {
                const response = await fetch(process.env.REACT_APP_API_URL + "user", {
                    method: "get",
                    headers: {
                        "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"]
                    }
                });
                if (!response.ok) {
                    console.log(response.json());
                    throw new Error(response.statusText);
                }
                setData(true);
                setLoading(false);
            } catch (err) {
                console.log(err);
                setError(error);
                setLoading(false);
            }
        }
        Authenticate();
    }, []);

    if (loading) return <Loading/>;

    if (error) return <div className="error">Error: {error.message}</div>

    if (data) return <Navigate to="/home" replace={true}/>

    // the reason why the same condition is repeated is because combining them breaks the formatting
    return(
        <div id="access">
            <Modal className="access-modal">
                <h1 id = "header">Time Splice</h1>
                <h3>Your online study assistant</h3>
                <div className="error">{err}</div>
                {(window.location.pathname!=='/signup') && <Login setErr={setErr}/>}
                {window.location.pathname!=='/signup' && 
                    <div className="redirect">Don't already have an account? <a href="/signup">Sign up here.</a></div>
                }
                {(window.location.pathname==='/signup') && <Signup setErr={setErr}/>}
                {window.location.pathname==='/signup' && 
                    <div className="redirect"><a href="/login">Return to Login.</a></div>
                }
            </Modal>
        </div>
    )
}

export default Access;