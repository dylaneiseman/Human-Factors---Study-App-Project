import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import "@css/pages/Settings.scss"

function Settings() {
    const [style, setStyle] = useOutletContext();

    async function handleSubmit(e) {
        try {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const formJson = Object.fromEntries(formData.entries());
            const response = await fetch(process.env.REACT_APP_API_URL + "user", {
                method: "put",
                headers: {
                    "authorization": "Bearer " + JSON.parse(localStorage.getItem("authToken"))["token"],
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({theme: formJson})
            });
            if (!response.ok) {
                console.log(response.json());
                throw new Error(response.statusText);
            }
            const json = await response.json();
            setStyle({...style, ...json.theme})
            window.location.reload()
        } catch (err) {
            console.log(err);
        }
    }

    function handleChange(e) {
        const input = e.target;
        const min = input.getAttribute("min");
        const value = input.value;
        if(value < min) return false;
        const prop = input.getAttribute("name");
        const newStyle = {};
        newStyle[prop] = value;
        setStyle({...style, ...newStyle})
    }

    const colorVars = [
        ["--accent1", "Accent 1"], 
        ["--accent1-text-color", "Accent 1 text color"], 
        ["--accent2", "Accent 2"],
        ["--accent2-text-color", "Accent 2 text color"],
        ["--background-color", "Primary background color"],
        ["--text-color", "Primary text color"],
        ["--off-background-color", "Secondary background color"],
        ["--off-background-color-text", "Secondary text color"],
        ["--form-background-color", "Form background color"],
        ["--form-text-color", "Form text color"]
    ];

    const cssval = (v) => window.getComputedStyle(document.documentElement).getPropertyValue(v);

    return(
        <div id="settings">
            <form id="new-course" method="post" onSubmit={handleSubmit}>
                {colorVars.map(variable => (
                    <div className="prefs" id={variable[0].slice(2)}>
                        <label for={variable[0]}>{variable[1]}</label>
                        <input type="color" name={variable[0]} defaultValue={cssval(variable[0])} onChange={handleChange}/>
                    </div>
                ))}
                <label for="--text-size">Text size</label>
                <input type="number" step="1" min="10" name="--text-size" defaultValue={cssval("--text-size")} onChange={handleChange}/>
                <input type="submit" value="Save"/>
            </form>
        </div>
    );
}

export default Settings;