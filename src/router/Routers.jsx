import ProtectedRoute from "../ProtectedRoute";
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
                path: 'logIn', element: <LogIn/>
            },
            {
                path: 'Register', element: <Register/>
            },
            {
                path: 'About', element: <About/>
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