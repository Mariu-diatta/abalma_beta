
import React, { Suspense, useEffect } from 'react'
import './App.css';
import routes from './router/Routers';
import { useRoutes} from "react-router-dom"
import CookieBanner from './components/CookieBanner';
import { AuthProvider } from './AuthContext';
import './i18n'; // ⚠️ Important
import LoadingCard from './components/LoardingSpin';
import { useTranslation } from "react-i18next";

const AppRoutes = () => {

    const routing = useRoutes(routes); // Utilisation des routes

    return routing;
};


function App() {

  return (

      <Suspense fallback={<LoadingCard/>}>

          <AuthProvider>

              <SEO />

              <AppRoutes />

              <CookieBanner />

          </AuthProvider>

      </Suspense>
         
  );
}

export default App;

export function SEO() {

    const { i18n } = useTranslation();

    useEffect(() => {
        // Définir les titres et descriptions par langue
        const metaDescriptions = {
            en: "Abalma is an innovative e-commerce platform with integrated chat for instant customer support and a smarter online shopping experience.",
            fr: "Abalma est une plateforme e-commerce innovante intégrant un système de chat pour un support client instantané et une expérience d'achat en ligne améliorée.",
        };

        const titles = {
            en: "Abalma - Smart E-commerce with Live Chat",
            fr: "Abalma - E-commerce intelligent avec chat intégré",
        };

        // Mise à jour du <title>
        document.title = titles[i18n.language] || titles.en;

        // Mise à jour du <meta description>
        let meta = document.querySelector("meta[name='description']");
        if (meta) {
            meta.setAttribute("content", metaDescriptions[i18n.language] || metaDescriptions.en);
        } else {
            // Si jamais la balise n'existe pas
            meta = document.createElement("meta");
            meta.name = "description";
            meta.content = metaDescriptions[i18n.language] || metaDescriptions.en;
            document.head.appendChild(meta);
        }
    }, [i18n.language]);

    return null; // ce composant n'affiche rien
}

