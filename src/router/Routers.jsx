// Imports
import ProtectedRoute from "../ProtectedRoute";

// Layouts
import AuthPage from "../layouts/AuthLayout";

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
import UpdateProduct from "../features/UpdateProduct";
import ChatLayout from "../layouts/ChatLayout";
import GridProductDefault from "../features/GridProductDefaultSize";
import Tabs from "../features/DashbordProfileUser";
import GridLayoutProduct from "../features/GridLayoutProducts";
import ProductsRecapTable from "../features/ProductRecaptable";
import ListProductShoppingCart from "../features/ListProductShoppingCart";
import SettingsForm from "../features/Settings";
import BlogPageHome, { BlogPage } from "../pages/Blog";
import { LIST_CATEGORY } from "../utils";


// Routes Configuration
const routes = [
    {
        errorElement: <ErrorPage />,

        children: [

            { index: true, element: <Home /> },

            { index: "home", element: <Home /> },

            { path: "logIn", element: <LogIn /> },

            { path: "register", element: <Register /> },

            { path: "about", element: <About /> },

            { path: "politique-confidentialite", element: <PrivacyPolicy /> },

            { path: "blogs", element: <BlogPageHome /> }, 

            { path: "forgetPassword", element: <LayoutPwdForget /> },

            { path:"forgetPassword/reset/:uidb64/:token", element:< LayoutPwdForget/> },

            {
                element: <ProtectedRoute/>,

                children: [

                    {
                        element: <PersistLogIn/>,

                        children: [

                            { path: "account", element: <AuthPage /> }, 

                            { path: "products", element: <GridLayoutProduct /> },

                            { path: "payment_card", element: <ListProductShoppingCart /> },

                            ...[

                                { path: "payment", class_rendered: <ListProductShoppingCart /> },

                                { path: "user_blogs", class_rendered: <BlogPage /> },

                                { path: "settings", class_rendered: <SettingsForm /> },

                                { path: "user_profil", class_rendered: <ProfileCard /> },

                                { path: "dashboard", class_rendered: <Tabs /> },

                                { path: "payment_product", class_rendered: <ProductsRecapTable /> },

                                { path: "all_products", class_rendered: <GridLayoutProduct /> },

                                { path: "account_home", class_rendered: <GridLayoutProduct /> },

                                { path: "add_product", class_rendered: <UpdateProduct /> },

                                { path: "message_inbox", class_rendered: <ChatLayout /> }

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
