import ProtectedRoute from "../ProtectedRoute";

import  VertcalNavbar, { ProductList, SelectedProduct, UserMenuAccount } from "../components/NavbarVertical";
import ProfileCard from "../components/ProfilUser";
import AdminPage from "../layouts/AdminLayout";
import AuthPage from "../layouts/AuthLayout";
import About from "../pages/About";
import BlogPage from "../pages/Blog";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import LogIn from "../pages/Login";
import Payment from "../pages/Payment";
import Register from "../pages/Register";



// Configuration des routes
const routes = [

    {
    

        errorElement: <ErrorPage />,

        children: [
            {
                index: true, element: <Home />
            },
            {
                path: 'logIn', element: <LogIn /> 
            },
            {
                path: 'user_profil', element: <VertcalNavbar >  <ProfileCard /></VertcalNavbar > 
            },
            {
                path: "payment_card", element: <SelectedProduct/>
            },
            {
                path: 'Register', element: <Register /> 
            },
            {
                path: 'About', element: <About/>
            },
            {
                path: "/products", element: <ProductList/>
            },
            {

                children: [

                    {
                        path: 'About', element: < About/>
                    },

                    {
                        element: <ProtectedRoute/>,

                        children: [

                            { path: 'account', element: <AuthPage/> },

                            { path: 'AdminPage', element: <AdminPage /> },

                            { path: 'Payment', element: <Payment /> },

                            { path: 'Blog', element: <BlogPage/> }
                        ],
                    },
                ],
            },
        ],
    },
];

export default routes;