import React from 'react'
import { useState } from 'react';
import "./Login.css";

function Login(props) {
    const [user, setUser] = useState({
        userName: "",
        email: "",
        password: ""
    });

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
                        name="userName"
                        value={user.userName}
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

                    <button onClick={register}>
                        Register
                    </button>

                    <button>
                        Log in
                    </button>
                    
                </fieldset>
            </form>
        </div>
    )
}

export default Login