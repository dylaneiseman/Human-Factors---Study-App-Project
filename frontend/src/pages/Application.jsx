import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Access from '@components/Access'
import Logout from '@components/Logout';

import "@css/pages/Application.scss"

function Application() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [style, setStyle] = useState({});

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
                const json = await response.json();
                if(json.theme) {
                    for(const [key, value] of Object.entries(json.theme)) {
                        document.documentElement.style.setProperty(key, value);
                    }
                }
                setData(json);
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
    
    function Child() {
        return(<>
            <div id="header">
                <div className="links">
                    <a href="/home">Dashboard</a>
                    <a href="/courses">Courses</a>
                    <a href="/assignments">Assignments</a>
                    <a href="/flashcards">Flashcards</a>
                    <a href="/settings">Preferences</a>
                </div>
                <Logout/>
            </div>
            <div id="wrapper">
                <Outlet context={[style, setStyle]}/>
            </div>
        </>)
    }
    const child = data===null ? <Access/> : Child();
    return(
        <div style={style} id="app">
            {child}
        </div>
    );
}

export default Application;