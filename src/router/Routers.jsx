import ProtectedRoute from "../ProtectedRoute";
import GridLayoutProduct from "../components/GridLayoutProducts";
import GridProductDefault from "../components/GridProductDefaultSize";
import DataTable from "../components/ListProductFilter";
import ProductTable from "../components/ListProductFilterWithImage";
import VertcalNavbar from "../components/NavbarVertical";
import Tabs from "../components/ProfileUser";
import AdminPage from "../layouts/AdminLayout";
import AuthPage from "../layouts/AuthLayout";
import About from "../pages/About";
import BlogPage from "../pages/Blog";
import ErrorPage from "../pages/ErrorPage";
import Home from "../pages/Home";
import LogIn from "../pages/Login";
import Payment from "../pages/Payment";
import Register from "../pages/Register";

const initialProducts = [
    {
        id: 1,
        name: "Apple Watch",
        image: "/docs/images/products/apple-watch.png",
        price: 599,
        quantity: 1,
    },
    {
        id: 2,
        name: 'iMac 27"',
        image: "/docs/images/products/imac.png",
        price: 2499,
        quantity: 1,
    },
    {
        id: 3,
        name: "iPhone 12",
        image: "/docs/images/products/iphone-12.png",
        price: 999,
        quantity: 1,
    },
];

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
                path: 'user_profil', element: <VertcalNavbar >   < Tabs /> </VertcalNavbar>
            },
            {
                path: "payment_card", element: <VertcalNavbar > <ProductTable initialProducts={initialProducts} /> </VertcalNavbar>
            },
            {
                path: 'Register', element: <Register /> 
            },
            {
                path: 'About', element: <About/>
            },
            {
                path: "/products", element: <VertcalNavbar ><GridLayoutProduct/> <GridProductDefault /></VertcalNavbar>
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