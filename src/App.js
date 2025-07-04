
import React from 'react'
import './App.css';
import routes from './router/Routers';
import { useRoutes} from "react-router-dom"
import CookieBanner from './components/CookieBanner';
import { AuthProvider } from './AuthContext';
import './i18n'; // ⚠️ Important

const AppRoutes = () => {

    const routing = useRoutes(routes); // Utilisation des routes

    return routing;
};

function App() {

  return (

      <AuthProvider>
  
          <AppRoutes />

          <CookieBanner />

      </AuthProvider>
         

  );
}

export default App;
