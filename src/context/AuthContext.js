import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

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
    
        console.log("Attempting to fetch user with token:", token);
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/protected`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });
    
            console.log("Auth check response:", response.status);
            const data = await response.json();
    
            if (response.ok) {
                console.log("User authenticated:", data.user);
                setUser(data.user);
            } else {
                console.warn('Authentication failed. Clearing token.');
                localStorage.removeItem("accessToken"); // Remove invalid token
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setUserLoading(false);
        }
    };
    

    // Sign in using development credentials
    const devSignIn = async () => {
        try {
            const devCredentials = { email: 'test@gmail.com', password: 'test' };
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(devCredentials),
                credentials: 'include', // Use cookies for persistent sessions
            });

            if (response.ok) {
                const data = await response.json(); // Parse JSON response
                localStorage.setItem('accessToken', data.accessToken); // Store token
                console.log('Dev Sign-In Token Stored:', data.accessToken);
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
        setUserLoading(true)
        const token = getStoredToken(); // Retrieve stored token
    
        if (!token) {
            console.log('No token found, skipping authentication check.'); 
            setUserLoading(false);
            return; // Stop here if no token
        }
    
        console.log("Token found. Attempting to authenticate...");
        await fetchUser(); // Fetch user only if token exists
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

