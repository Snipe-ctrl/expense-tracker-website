import React, { createContext, useState, useEffect } from 'react';
import { refreshAccessToken } from "../utils/refreshAccessToken"; // Import from utils


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
            console.warn("No access token found.");
            setUser(null);
            setUserLoading(false);
            return;
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/protected`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setUser(data.user);
            } else if (response.status === 401) {
                
                const newToken = await refreshAccessToken(); // Call utility function
    
                if (newToken) {
                    return fetchUser(); // Retry with new token
                } else {
                    console.warn("❌ Failed to refresh token. Logging out.");
                    setUser(null);
                    localStorage.removeItem("accessToken");
                }
            } else {
                console.warn("Authentication failed. Clearing token.");
                localStorage.removeItem("accessToken");
                setUser(null);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setUserLoading(false);
        }
    };    

    const scheduleTokenRefresh = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            // Decode token to get expiration time
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expiresInMs = (payload.exp * 1000) - Date.now(); // Time left in milliseconds

            if (expiresInMs > 5000) { // Schedule slightly before expiration
                console.log(`🔄 Scheduling token refresh in ${Math.floor(expiresInMs / 1000)} seconds`);
                
                setTimeout(async () => {
                    console.log("🔄 Auto-refreshing token...");
                    const newToken = await refreshAccessToken();
                    if (newToken) scheduleTokenRefresh(); // Reschedule if refresh is successful
                }, expiresInMs - 5000); // Refresh 5 seconds before expiry
            }
        } catch (error) {
            console.error("Error decoding access token:", error);
        }
    };

    // Check authentication and sign in
    const initializeAuth = async () => {
        setUserLoading(true);
    
        let token = localStorage.getItem("accessToken");
    
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const now = Date.now() / 1000;
    
            if (payload.exp < now) {
                console.warn("🔄 Access token expired. Attempting refresh...");
                token = await refreshAccessToken();
            }
        }
    
        // If we have a valid token, attempt to fetch user
        if (token) {
            await fetchUser();
        } else {
            console.warn("❌ No valid access token. Logging out.");
            setUser(null);
            localStorage.removeItem("accessToken");
        }
    
        setUserLoading(false);
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

