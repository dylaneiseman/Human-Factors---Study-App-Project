import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

function Scheduler(args){
    const navigate = useNavigate()
    const [error, setError] = useState(null);

    const { start, end } = args;

    async function handleSubmit(e) {        
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'scheduler', { 
                method: form.method,
                body: JSON.stringify(formJson), 
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"],
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json();
            if(!response.ok) {
                throw new Error(json)
            }
            window.location.reload();
        } catch (err) {
            setError(<div className="error">Error: {err.message}</div>)
        }
    }

    return(<>
        {error}
        <form id="scheduler" method="post" onSubmit={handleSubmit}>
            <input required type="date" id="semesterStart" name="semesterStart" defaultValue={(start===null || start===undefined) ? new Date().toISOString().split("T")[0] : start.split("T")[0]}/>
            <input required type="date" id="semesterEnd" name="semesterEnd" defaultValue={end?.split("T")[0]}/>
            <input type="submit" value="Update Dates"/>
        </form>
    </>)
}

export default Scheduler;