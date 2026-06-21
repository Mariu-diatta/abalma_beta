import { lazy } from "react";

// Imports
import ProtectedRoute from "../ProtectedRoute";

// Pages critiques (chargées immédiatement : page d'accueil + gestion des erreurs)
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";

// Auth (petit, sur le chemin critique de toutes les routes protégées)
import PersistLogIn from "../features/auth/PersistLogin";
import VertcalNavbar from "../features/NavbarVertical";

import { LIST_CATEGORY } from "../utils";

// ─── Tout le reste est chargé à la demande (code-splitting) ────────────────
// Ces pages ne sont visitées qu'après navigation explicite (paiement,
// dashboard, gestion produit, chat, blog...) — les charger en différé
// réduit fortement le bundle initial téléchargé par chaque visiteur.
const About = lazy(() => import("../pages/About"));
const ProfileCard = lazy(() => import("../features/ProfilUser"));
const PrivacyPolicy = lazy(() => import("../features/PrivacyPolicy"));
const LayoutPwdForget = lazy(() => import("../pages/forgetPassword"));
const AddUploadProduct = lazy(() => import("../features/UpdateProduct"));
const ChatLayout = lazy(() => import("../layouts/ChatLayout"));
const GridProductDefault = lazy(() => import("../features/GridProductDefaultSize"));
const Tabs = lazy(() => import("../features/DashbordProfileUser"));
const GridLayoutProduct = lazy(() => import("../features/GridLayoutProducts"));
const ProductsRecapTable = lazy(() => import("../features/ProductRecaptable"));
const ListProductShoppingCart = lazy(() => import("../features/ListProductShoppingCart"));
const SettingsForm = lazy(() => import("../features/Settings"));
const BlogPageHome = lazy(() => import("../pages/Blog").then((m) => ({ default: m.default })));
const BlogPage = lazy(() => import("../pages/Blog").then((m) => ({ default: m.BlogPage })));
const HelpPage = lazy(() => import("../layouts/HelpLayout"));
const PaySuccess = lazy(() => import("../features/PaySuccess"));
const PayCancel = lazy(() => import("../features/PayCancel"));
const SubscriptionsPage = lazy(() => import("../pages/SubscriptionCard"));


// Routes Configuration
const routes = [
    {
        errorElement: <ErrorPage/>,

        children: [

            { index: true, element: <Home/> },

            { path: "about", element: <About /> },

            { path: "politique-confidentialite", element: <PrivacyPolicy /> },

            { path: "blogs", element: <BlogPageHome/> }, 

            { path: "forgetPassword", element: <LayoutPwdForget/> },

            { path: "forgetPassword/reset/:uidb64/:token", element: <LayoutPwdForget/> },

            {
        
                element: <PersistLogIn />,

                children: [

                    {
                        element: <ProtectedRoute />,

                        children: [

                            { path: "success", element: <PaySuccess /> },

                            { path: "cancel", element: <PayCancel /> },

                            { path: "subscription", element: <SubscriptionsPage/> },

                            ...[
                                { path: "help", class_rendered: <HelpPage /> },

                                { path: "payment", class_rendered: <ListProductShoppingCart /> },

                                { path: "payment-card", class_rendered: <ListProductShoppingCart /> },

                                { path: "user-blogs", class_rendered: <BlogPage /> },

                                { path: "settings", class_rendered: <SettingsForm /> },

                                { path: "user-profil", class_rendered: <ProfileCard /> },

                                { path: "user-profil-contact", class_rendered: <ProfileCard /> },

                                { path: "dashboard", class_rendered: <Tabs /> },

                                { path: "payment-product", class_rendered: <ProductsRecapTable /> },

                                { path: "all-products", class_rendered: <GridLayoutProduct /> },

                                { path: "account-home", class_rendered: <GridLayoutProduct /> },

                                { path: "add-product", class_rendered: <AddUploadProduct /> },

                                { path: "message-inbox", class_rendered: <ChatLayout /> }

                            ].map(

                                (value) => (

                                    {
                                        path:value.path, element: (

                                            <VertcalNavbar>

                                                {value.class_rendered}

                                            </VertcalNavbar>
                                        ),
                                    }
                                )
                            ),

                            ...LIST_CATEGORY.map((category) => ({

                                path: category?.idx,

                                element: (

                                    <VertcalNavbar>

                                        <GridProductDefault categorie_item={category.filter} />

                                    </VertcalNavbar>
                                ),
                            })),
                        ]

                    }
                ]
            },

        ]
    }
];

export default routes;
