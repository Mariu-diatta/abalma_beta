import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const token = localStorage.getItem("token");

    const hasAccess = isAuthenticated &&  Boolean(token);

    if (!hasAccess) {

        return <Navigate to="/logIn" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
