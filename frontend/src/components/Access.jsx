import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom'

import Modal from "@components/Modal";

import Login from "@forms/Login";
import Signup from "@forms/Signup";
import Logout from "@components/Logout";

import "@css/components/Access.scss";

function Access(){
    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        async function Authenticate() {
            try {
                const response = await fetch("http://localhost:4000/api/user/", {
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

    if (loading) return <div>Loading...</div>;

    if (error) return <div>Error: {error.message}</div>;

    if (data) return <Navigate to="/home" replace={true}/>

    return(
        <div id="access">
            <Modal>
                <Login/>
                <Signup/>
            </Modal>
        </div>
    )
}

export default Access;