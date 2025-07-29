
import React, { Suspense } from 'react'
import './App.css';
import routes from './router/Routers';
import { useRoutes} from "react-router-dom"
import CookieBanner from './components/CookieBanner';
import { AuthProvider } from './AuthContext';
import './i18n'; // ⚠️ Important
import LoadingCard from './components/LoardingSpin';

const AppRoutes = () => {

    const routing = useRoutes(routes); // Utilisation des routes

    return routing;
};


function App() {

  return (

      <Suspense fallback={<LoadingCard/>}>

          <AuthProvider>
  
              <AppRoutes />

              <CookieBanner />

          </AuthProvider>

      </Suspense>
         
  );
}

export default App;
