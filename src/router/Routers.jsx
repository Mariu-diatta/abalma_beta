// Imports
import ProtectedRoute from "../ProtectedRoute";

// Layouts
import AuthPage from "../layouts/AuthLayout";

// Pages
import About from "../pages/About";
import BlogPage from "../pages/Blog";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import LogIn from "../pages/Login";
import Register from "../pages/Register";

// Components
import VerticalNavbar from "../features/NavbarVertical";
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


// Routes Configuration
const routes = [
    {
        errorElement: <ErrorPage />,

        children: [
            { index: true, element: <Home /> },
            { path: "logIn", element: <LogIn /> },
            { path: "register", element: <Register /> },
            { path: "about", element: <About /> },
            { path: "politique-confidentialite", element: <PrivacyPolicy/> },
            { path: "products", element: <GridLayoutProduct /> },
            { path: "payment_card", element: <ListProductShoppingCart/> },
            { path: "blog", element: <BlogPage /> }, 
            { path: "forgetPassword", element: <LayoutPwdForget /> },

            {
                element: <ProtectedRoute/>,

                children: [

                    {
                        element: <PersistLogIn/>,

                        children: [

                            { path: "account", element: <AuthPage /> }, 

                            {
                                path: "payment", element: (

                                    <VertcalNavbar>

                                        <ListProductShoppingCart />

                                    </VertcalNavbar> 
                                ),
                            },
                            {
                                path: "settings", element: (

                                    <VertcalNavbar>

                                        <SettingsForm/>

                                    </VertcalNavbar>
                                ),
                            },

                            {
                                path: "user_profil",

                                element: (

                                    <VerticalNavbar>

                                        <ProfileCard />

                                    </VerticalNavbar>
                                )
                            },

                            {
                                path: "dashboard",

                                element: (

                                    <VertcalNavbar>

                                        <Tabs/>

                                    </VertcalNavbar>
                                ),
                            }
                            ,
                            {
                                path: "payment_product",

                                element: (

                                    <VertcalNavbar>

                                        <ProductsRecapTable/>

                                    </VertcalNavbar>
                                ),
                            }
                            ,
                            {
                                path: "all_products",

                                element: (

                                    <VertcalNavbar>

                                        <GridLayoutProduct/>

                                    </VertcalNavbar>
                                ),
                            }
                            ,
                            {
                                path: "account_home",

                                element: (
                                    <VertcalNavbar>

                                        <GridLayoutProduct/>

                                    </VertcalNavbar>
                                ),
                            },
                            {
                                path: "add_product",

                                element: (
                                    <VertcalNavbar>

                                        <UpdateProduct />

                                    </VertcalNavbar>
                                ),
                            }, 
                            {
                                path: "message_inbox",

                                element: (

                                    <VertcalNavbar>

                                        <ChatLayout />

                                    </VertcalNavbar>
                                ),
                            },
                            ...[

                                "jouets", "sacs", "materiels", "electronique", "habits",

                                "livres", "Jeux_video", "Meubles", "Vehicules",

                                "Fournitures_scolaires", "divers",

                            ].map((category) => ({

                                path: category,

                                element: (

                                    <VertcalNavbar>

                                        <GridProductDefault />

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
