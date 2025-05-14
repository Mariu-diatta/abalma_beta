import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
;


const ProtectedRoute = () => {


    return false? <Outlet /> : <Navigate to="/logIn" replace />;
};

export default ProtectedRoute;