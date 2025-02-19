import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3001/api"

// AuthProvider Component
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User state
    const [userLoading, setUserLoading] = useState(true); // Loading state

    // Helper function to get the stored access token
    const getStoredToken = () => localStorage.getItem('accessToken');

    // Fetch the authenticated user
    const fetchUser = async () => {
        const token = getStoredToken(); // Retrieve token

        if (!token) {
            console.warn('No token found in localStorage.');
            setUser(null);
            setUserLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/protected`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user); // Update user state
            } else {
                console.warn('Failed to fetch user. Status:', response.status);
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setUserLoading(false); // Set loading to false
        }
    };

    // Sign in using development credentials
    const devSignIn = async () => {
        try {
            const devCredentials = { email: 'test@gmail.com', password: 'test' };
            const response = await fetch(`${API_BASE_URL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(devCredentials),
                credentials: 'include', // Use cookies for persistent sessions
            });

            if (response.ok) {
                const data = await response.json(); // Parse JSON response
                localStorage.setItem('accessToken', data.accesstoken); // Store token
                console.log('Dev Sign-In Token Stored:', data.accesstoken);
                await fetchUser(); // Fetch the user after signing in
            } else {
                console.error('Dev Sign-In failed. Status:', response.status);
            }
        } catch (error) {
            console.error('Error during dev sign-in:', error);
        }
    };

    // Check authentication and sign in during development
    const initializeAuth = async () => {
        await fetchUser(); // Attempt to fetch user with the existing token
        if (!user) {
            console.log('No user found. Attempting dev sign-in...');
            await devSignIn();
        }
    };

    // Run on component mount
    useEffect(() => {
        initializeAuth();
    }, []); // Empty dependency array ensures this runs once

    // Context value
    const contextValue = {
        user,
        setUser,
        userLoading,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

