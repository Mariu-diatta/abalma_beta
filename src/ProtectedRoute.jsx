import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
    // Accès au state Redux
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return isAuthenticated ? <Outlet /> : <Navigate to="/logIn" replace />;
};

export default ProtectedRoute;
