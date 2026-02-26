// Imports
import ProtectedRoute from "../ProtectedRoute";

// Layouts

// Pages
import About from "../pages/About";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import LogIn from "../pages/Login";
import Register from "../pages/Register";

// Components
import PersistLogIn from "../features/auth/PersistLogin";
import ProfileCard from "../features/ProfilUser";
import PrivacyPolicy from "../features/PrivacyPolicy";
import LayoutPwdForget from "../pages/forgetPassword";
import VertcalNavbar from "../features/NavbarVertical";
import AddUploadProduct from "../features/UpdateProduct";
import ChatLayout from "../layouts/ChatLayout";
import GridProductDefault from "../features/GridProductDefaultSize";
import Tabs from "../features/DashbordProfileUser";
import GridLayoutProduct from "../features/GridLayoutProducts";
import ProductsRecapTable from "../features/ProductRecaptable";
import ListProductShoppingCart from "../features/ListProductShoppingCart";
import SettingsForm from "../features/Settings";
import BlogPageHome, { BlogPage } from "../pages/Blog";
import { LIST_CATEGORY } from "../utils";
import HelpPage from "../layouts/HelpLayout";
import PaySuccess from "../features/PaySuccess";
import PayCancel from "../features/PayCancel";
import SubscriptionsPage from "../pages/SubscriptionCard";


// Routes Configuration
const routes = [
    {
        errorElement: <ErrorPage />,

        children: [

            { index: true, element: <Home /> },

            { index: "home", element: <Home /> },

            { path: "register", element: <Register /> },

            { path: "about", element: <About /> },

            { path: "politique-confidentialite", element: <PrivacyPolicy /> },

            { path: "blogs", element: <BlogPageHome /> }, 

            { path: "forgetPassword", element: <LayoutPwdForget /> },

            { path: "forgetPassword/reset/:uidb64/:token", element: < LayoutPwdForget /> },

            { path: "logIn", element: <LogIn /> },

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
