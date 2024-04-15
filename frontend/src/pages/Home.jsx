import React, { useState, useEffect } from 'react';

import Todo from "@components/Todo"
import Loading from '@pages/Loading';

import "@css/pages/Home.scss"

function Home(){
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
                setData(json.length)
            } catch (err) {
                console.log(err);
                setError(error);
            }
        }
        getData();
    }, []);

    if (data === null) return <Loading/>;

    if (error) return <div>Error: {error.message}</div>;

    const create = data > 0 ? "assignment" : "course";
    return(
        <div id="home">
            <a href="/courses" id="overview">
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z"/></svg>
                    courses
                </span>
            </a>
            <div className="createstrip"></div>
            <a href={"/"+create+"s/new"} id="create">
                Create a new {create}
            </a>
            <Todo/>
        </div>
    )
}

export default Home;