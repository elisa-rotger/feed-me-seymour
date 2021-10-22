import React from 'react'
import { useState } from 'react';
import "./Login.css";

function Login(props) {
    console.log(JSON.stringify(props));
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

    function request() {
        props.onRequest();
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

                    <div className="button-container">
                        <button type="button" onClick={register}>
                            Register
                        </button>

                        <button type="button" onClick={login}>
                            Log in
                        </button>

                        <button type="button">
                            Log out
                        </button>
                    </div>
                    
                </fieldset>
                <div className="message">
                    <span>{props.status.message}</span>
                </div>
            </form>

            <button type="button" className="garden-btn" onClick={request}>
                See my plants
            </button>
        </div>
    )
}

export default Login