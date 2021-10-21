import React from 'react'
import { useState } from 'react';
import "./Login.css";

function Login(props) {
    const emptyUser = {
        username: "",
        email: "",
        password: ""
    }
    const [user, setUser] = useState(emptyUser);

    function handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        setUser((state) => ({
            ...state,
            [name]: value,
        }))
    }

    function register() {
        props.onRegister(user);
        setUser(emptyUser);
    }

    function login() {
        props.onLogin(user);
        setUser(emptyUser);
    }

    return (
        <div className="login-wrap">
            <form className="grid-container" id="login">
                <fieldset className="form-container" id="login-container">
                    <legend>
                        <h3>Log in here!</h3>
                    </legend>

                    <label className="form-input">
                        <span>Username:</span>
                        <input
                        type="text"
                        name="username"
                        value={user.username}
                        onChange={handleChange} />
                    </label>

                    <label className="form-input">
                        <span>Email:</span>
                        <input
                        type="text"
                        name="email"
                        value={user.email}
                        onChange={handleChange} />
                    </label>

                    <label className="form-input">
                        <span>Password:</span>
                        <input
                        type="password"
                        name="password"
                        value={user.password}
                        onChange={handleChange} />
                    </label> <br />

                    <button type="button" onClick={register}>
                        Register
                    </button>

                    <button type="button" onClick={login}>
                        Log in
                    </button>
                    
                </fieldset>
            </form>
            <div>
                <span>{props.status}</span>
            </div>
        </div>
    )
}

export default Login