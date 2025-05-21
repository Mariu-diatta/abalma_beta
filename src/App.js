
import React from 'react'
import './App.css';
import routes from './router/Routers';
import { useRoutes} from "react-router-dom"
import CookieBanner from './components/CookieBanner';

const AppRoutes = () => {

    const routing = useRoutes(routes); // Utilisation des routes

    return routing;
};

function App() {

    return (

    <>
       
        <AppRoutes />
        <CookieBanner/>
         
    </>
  );
}

export default App;
