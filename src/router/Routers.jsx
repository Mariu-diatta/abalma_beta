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
import Payment from "../pages/Payment";
import Register from "../pages/Register";

// Components
import VerticalNavbar, {
    ProductList,
    SelectedProduct,
} from "../features/NavbarVertical";
import PersistLogIn from "../features/auth/PersistLogin";
import ProfileCard from "../features/ProfilUser";
import PrivacyPolicy from "../features/PrivacyPolicy";

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
            { path: "products", element: <ProductList /> },
            { path: "payment_card", element: <SelectedProduct /> },
            { path: "blog", element: <BlogPage /> },

            {
                path: "user_profil",

                element: (

                    <VerticalNavbar>

                        <ProfileCard/>

                    </VerticalNavbar>
                )
            },
            {
                element: <ProtectedRoute/>,

                children: [

                    {
                        element: <PersistLogIn/>,

                        children: [

                            { path: "account", element: <AuthPage /> },

                            { path: "payment", element: <Payment /> },
                        ]
                    }
                ]
            },

        ]
    }
];

export default routes;
