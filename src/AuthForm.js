import React, { useState } from "react";
import axios from "axios";

const AuthForm = ({ onAuthentication }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`/${isLogin ? "login" : "register"}`, { email, password });
            if (isLogin) {
                // Store the JWT token in localStorage or React context
                localStorage.setItem("token", response.data.token);
                onAuthentication(response.data.token); // Call the onAuthentication prop function
            } else {
                // Handle successful registration
                console.log("Registration successful");
            }
        } catch (error) {
            console.error(error);
            // Handle error
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setEmail("");
        setPassword("");
    };

    return (
        <div>
            <h2>{isLogin ? "Login" : "Register"}</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">{isLogin ? "Login" : "Register"}</button>
            </form>
            <button onClick={toggleMode}>
                {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
            </button>
        </div>
    );
};

export default AuthForm;
