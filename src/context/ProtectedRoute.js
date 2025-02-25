import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
    const { user, userLoading } = useContext(AuthContext);

    return user ? children : <Navigate to='/signin' replace/>;
}

export default ProtectedRoute;