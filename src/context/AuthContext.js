import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const signIn = async (email, password) => {

        try {
            const response = await fetch('http://localhost:3001/auth/signin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password}),
            });

            const data = await response.json();

            if (data.accesstoken) {
                setAuthToken(data.accesstoken);
                await fetchUser(data.accesstoken);
                return true;
            } else {
                alert(data.message);
                return false;
            }
    } catch (error) {
        console.error('Error signing in', error);
        return false;
    }
}
    const fetchUser = async (token) => {
        try {
            const response = await fetch('http://localhost:3001/auth/protected', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setAuthToken(null);
                setUser(null);
            }
        } catch (error) {
            console.error('Error fetching user', error)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const devEmail = 'test@gmail.com';
        const devPass = 'test';

        if (!authToken) {
            signIn(devEmail, devPass);
        }
    }, [authToken]);

    // useEffect(() => {
    //     if (authToken) {
    //         fetchUser(authToken);
    //     }
    // }, [authToken]);

    return (
        <AuthContext.Provider value={{ authToken, user, signIn, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;