import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, userLoading } = useContext(AuthContext);

    if (userLoading) {
        return (
            <div className='main-spinner-container'>
                <div className='spinner'></div>
            </div>
        )
    };

    return user ? children : <Navigate to='/signin' replace/>;
}

export default ProtectedRoute;