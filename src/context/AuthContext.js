import React, { createContext, useState, useEffect } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider Component
const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    // Helper function to get the stored access token
    const getStoredToken = () => localStorage.getItem('accessToken');

    // Fetch the authenticated user
    const fetchUser = async () => {
        let token = getStoredToken();
    
        if (!token) {
            console.warn('No access token found.');
            setUser(null);
            setUserLoading(false);
            return;
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/protected`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setUser(data.user);
            } else if (response.status === 401) {
                console.warn("Access token expired. Trying to refresh...");
    
                const newToken = await refreshAccessToken();
    
                if (newToken) {
                    return fetchUser();
                } else {
                    console.warn("❌ Failed to refresh token. Logging out.");
                    setUser(null);
                    localStorage.removeItem("accessToken");
                }
            } else {
                console.warn('Authentication failed. Clearing token.');
                localStorage.removeItem("accessToken");
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setUserLoading(false);
        }
    };
    

    const refreshAccessToken = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/refresh_token`, {
                method: 'POST',
                credentials: 'include',
            });
    
            const data = await response.json();
    
            if (response.ok && data.accessToken) {
                console.log("🔄 Access token refreshed!");
                localStorage.setItem('accessToken', data.accessToken); 
                return data.accessToken;
            } else {
                console.warn("❌ Refresh token invalid. Logging out.");
                localStorage.removeItem("accessToken");
                setUser(null);
                return null;
            }
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return null;
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
                await fetchUser(); // Fetch the user after signing in
            } else {
                console.error('Dev Sign-In failed. Status:', response.status);
            }
        } catch (error) {
            console.error('Error during dev sign-in:', error);
        }
    };

    // Check authentication and sign in
    const initializeAuth = async () => {
        setUserLoading(true)
        const token = getStoredToken(); // Retrieve stored token
    
        if (!token) {
            console.log('No token found, skipping authentication check.'); 
            setUserLoading(false);
            return; // Stop here if no token
        }
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

