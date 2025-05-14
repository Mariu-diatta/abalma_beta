
import React from 'react'
import './App.css';
import routes from './router/Routers';
import { useRoutes, BrowserRouter } from "react-router-dom"

const AppRoutes = () => {
    const routing = useRoutes(routes); // Utilisation des routes
    return routing;
};

function App() {
  return (
    <>
       
       <AppRoutes />
         
    </>
  );
}

export default App;
