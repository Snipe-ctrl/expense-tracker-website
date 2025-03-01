import React, { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import '/src/styles/style.scss';

let userEmail = ""

const SigninForm = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // checks if email is a valid format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };    

    // handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert('Please fill in all the fields!');
            return;
        }
    
        if (!isValidEmail(formData.email)) {
            alert('Please enter a valid email address!');
            return;
        }

        try {

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken') || ''}`,
                },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
                credentials: 'include', // Use credentials to include cookies
            });

            const data = await response.json();

            if (response.ok && data.user) {
                localStorage.setItem('accessToken', data.accesstoken);
                setUser(data.user);
                navigate('/dashboard');

            } else {
                alert(data.message || 'Failed to sign in');
            }
        } catch (error) {
            console.error('Error signing in:', error);
            alert('An error occurred during sign-in.');
        }
    };


    return (
        <div className="signup-wrapper">
        <div className="signup-container">
            <svg
                width="36"
                height="32"
                viewBox="0 0 36 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M4.5 0.25C2.01797 0.25 0 2.26797 0 4.75V27.25C0 29.732 2.01797 31.75 4.5 31.75H31.5C33.982 
                        31.75 36 29.732 36 27.25V11.5C36 9.01797 33.982 7 31.5 7H5.625C5.00625 7 4.5 6.49375 4.5 5.875C4.5 5.25625 
                        5.00625 4.75 5.625 4.75H31.5C32.7445 4.75 33.75 3.74453 33.75 2.5C33.75 1.25547 32.7445 0.25 31.5 0.25H4.5ZM29.25 
                        17.125C29.8467 17.125 30.419 17.3621 30.841 17.784C31.2629 18.206 31.5 18.7783 31.5 19.375C31.5 19.9717 31.2629 20.544 
                        30.841 20.966C30.419 21.3879 29.8467 21.625 29.25 21.625C28.6533 21.625 28.081 21.3879 27.659 20.966C27.2371 20.544 27 
                        19.9717 27 19.375C27 18.7783 27.2371 18.206 27.659 17.784C28.081 17.3621 28.6533 17.125 29.25 17.125Z"
                    fill="#2563EB"
                />
            </svg>
            <h2>Welcome back</h2>
            <h3>Sign into your account</h3>
            <form className="signin-container" onSubmit={handleSubmit}>
                <div className="signup-signin-input-container">
                    <label htmlFor="email-input">Email address</label>
                    <input
                        className="input-box"
                        id="email-input"
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                    />
                </div>
                <div className="signup-signin-input-container">
                    <label htmlFor="password-input">Password</label>
                    <input
                        className="input-box"
                        id="password-input"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="•••••••••••••"
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
            <div className="sign-in-container">
                <p>Don't have an account? Sign up</p>
            </div>
        </div>
    </div>
);
};

export { userEmail }
export default SigninForm;