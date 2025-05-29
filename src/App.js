
import React, { Suspense } from 'react'
import './App.css';
import routes from './router/Routers';
import { useRoutes} from "react-router-dom"
import CookieBanner from './components/CookieBanner';
import { AuthProvider } from './AuthContext';

const AppRoutes = () => {

    const routing = useRoutes(routes); // Utilisation des routes

    return routing;
};

function App() {

  return (

      <AuthProvider>

          <Suspense fallback={"Loarding..."}>
            
              <AppRoutes />

          </Suspense>

          <CookieBanner />

      </AuthProvider>
         

  );
}

export default App;
