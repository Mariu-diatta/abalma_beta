import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const currentUser = useSelector((state) => state.auth.user);

    const hasAccess = isAuthenticated && !!currentUser;

    if (!hasAccess) {

        return <Navigate to="/logIn" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
