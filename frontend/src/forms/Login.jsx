import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';

function Login(args){
    const navigate = useNavigate()
    const {setErr} = args;

    async function handleSubmit(e) {        
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(process.env.REACT_APP_API_URL + 'user/login', { 
                method: form.method,
                body: JSON.stringify(formJson), 
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const json = await response.json();
            if(!response.ok) {
                setErr("Login: " + json)
                return false;
            }
            localStorage.setItem("authToken", JSON.stringify(json));
            if(window.location.pathname.slice(1)=='/') navigate("/home");
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }
    return(
        <form id="login" method="post" onSubmit={handleSubmit}>
            <input required type="email" id="email" name="email" placeholder="email@provider.com"/>
            <input required type="password" id="password" name="password" placeholder="password"/>
            <input type="submit" value="Login"/>
        </form>
    )
}

export default Login;