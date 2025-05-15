import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
;


const ProtectedRoute = () => {


    return true? <Outlet /> : <Navigate to="/logIn" replace />;
};

export default ProtectedRoute;