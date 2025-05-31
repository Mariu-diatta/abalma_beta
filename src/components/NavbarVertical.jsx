import AccountDropdown3 from "./DropDownAccount";
import GridLayoutProduct from "./GridLayoutProducts";
import GridProductDefault from "./GridProductDefaultSize";
import ProductTable from "./ListProductShoppingCart";
import Logo from "./LogoApp";
import Tabs from "./DashbordProfileUser";
import UpdateProduct from "./UpdateProduct";
import MessageCard from "./MessageCard";
import PrivacyPolicy from "./PrivacyPolicy";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentNav } from '../slices/navigateSlice'
import ProfileCard from "./ProfilUser";
import api from "../services/Axios";
import { useEffect, useRef, useState } from "react";


const lesAccount = async () => {

    try {

        const response = await api.get('/clients/')

        console.log(response.data)

    } catch (error) {

        console.error('Erreur lors de la récupération des clients', error)
    }
}

const menuItems = [
    {
        name: 'Products',
        to: '/products',
        id: "products",
        svg: (
            <svg className="shrink-0 w-6 h-7 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
            </svg>
        ),
    },
    {
        name: 'Habits',
        to: '/habits',
        id:2,
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path fillRule="evenodd" d="M5.833 5a5 5 0 0 1 3-1h6.334a5 5 0 0 1 3 1L21.1 7.2a1 1 0 0 1 .268 1.296l-2 3.5a1 1 0 0 1-1.382.361l-.986-.59V19a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-7.234l-.985.591a1 1 0 0 1-1.383-.36l-2-3.5A1 1 0 0 1 2.9 7.2L5.833 5ZM14 5h-4c0 .425.223.933.645 1.355.422.423.93.645 1.355.645.425 0 .933-.222 1.355-.645.423-.422.645-.93.645-1.355Z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        name: 'Livres',
        to: '/livres',
        id:3,
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
            </svg>
        ),
    },
    {
        name: 'Materiels',
        to: '/Materials',
        id:4,
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 23">
                <path d="M8.4 6.763c-.251.1-.383.196-.422.235L6.564 5.584l2.737-2.737c1.113-1.113 3.053-1.097 4.337.187l1.159 1.159a1 1 0 0 1 1.39.022l4.105 4.105a1 1 0 0 1 .023 1.39l1.345 1.346a1 1 0 0 1 0 1.415l-2.052 2.052a1 1 0 0 1-1.414 0l-1.346-1.346a1 1 0 0 1-1.323.039L11.29 8.983a1 1 0 0 1 .04-1.324l-.849-.848c-.18-.18-.606-.322-1.258-.25a3.271 3.271 0 0 0-.824.202Zm1.519 3.675L3.828 16.53a1 1 0 0 0 0 1.414l2.736 2.737a1 1 0 0 0 1.414 0l6.091-6.091-4.15-4.15Z" />
            </svg>
        ),
    },
    {
        name: 'Jouets',
        to: '/jouet',
        id:5,
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 23">
                <path fillRule="evenodd" d="M12 2a10 10 0 1 0 10 10A10.009 10.009 0 0 0 12 2Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.093 20.093 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM10 3.707a8.82 8.82 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.755 45.755 0 0 0 10 3.707Zm-6.358 6.555a8.57 8.57 0 0 1 4.73-5.981 53.99 53.99 0 0 1 3.168 4.941 32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.641 31.641 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM12 20.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 15.113 13a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        name: 'Electronique',
        to: '/electronique',
        id:6,
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z" />
            </svg>
        ),
    },
    {
        name: 'Cuisine',
        to: '/cuisine',
        id:7,
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
              <path fill="currentColor" fillRule="evenodd" d="M12.2605 3.79368c-.281-.22353-.5975-.3898-.9173-.5062-.7024-.25567-1.49918-.30568-2.24095-.18661-1.15818.18592-2.51613.88193-2.97474 2.22764-.40442.04107-.77944.1442-1.12195.31017-.59942.29046-1.02697.73841-1.32274 1.22999C3.11436 7.81349 3 8.97014 3 9.78568c0 .89142.27124 1.65012.76053 2.21432H20.3218c.0101-.0125.0201-.0251.0301-.0379.4919-.6324.6411-1.4185.6479-2.12509.1233-1.32715-.3036-2.47-1.0971-3.27874-.6018-.6132-1.3829-1.00304-2.2193-1.15392-.431-1.19435-1.444-2.10209-2.8973-2.26254-.9135-.10087-1.819.19102-2.5256.65187ZM9 8c0-.55228.44772-1 1-1h.01c.5523 0 1 .44772 1 1s-.4477 1-1 1H10c-.55228 0-1-.44772-1-1Zm4 0c0-.55228.4477-1 1-1h.01c.5523 0 1 .44772 1 1s-.4477 1-1 1H14c-.5523 0-1-.44772-1-1Zm-7 2c0-.55228.44772-1 1-1h.01c.55228 0 1 .44772 1 1 0 .5523-.44772 1-1 1H7c-.55228 0-1-.4477-1-1Zm5 0c0-.55228.4477-1 1-1h.01c.5523 0 1 .44772 1 1 0 .5523-.4477 1-1 1H12c-.5523 0-1-.4477-1-1Zm5 0c0-.55228.4477-1 1-1h.01c.5523 0 1 .44772 1 1 0 .5523-.4477 1-1 1H17c-.5523 0-1-.4477-1-1Z" clipRule="evenodd"/>
              <path fill="currentColor" d="M20.6134 14.6222c.1145-.3088-.1249-.6222-.4542-.6222H3.84086c-.32935 0-.56875.3134-.45429.6222.76918 2.0753 2.462 3.7423 4.59004 4.6741V20c0 .5523.44772 1 1 1h6.04679c.5523 0 1-.4477 1-1v-.7037c2.128-.9318 3.8209-2.5988 4.59-4.6741Z"/>
            </svg>
        ),
    },
    {
        name: 'Help',
        to: '/help',
        id:8,
        svg: (
            <svg className="shrink-0 w-5 h-5 ...">
                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
            </svg>
        ),
    },
];

const VertcalNavbar = ({ children }) => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const dispatch = useDispatch();

    const current = useSelector(state => state.navigate.currentNav);

    const sidebarRef = useRef();

    const updateActiveTab = (tab) => {

        dispatch(setCurrentNav(tab))

        lesAccount()
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarOpen(false);
            }
        }

        if (isSidebarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isSidebarOpen]);

    const tabContent = {

        "products": <ProductList />, 
        "profile": <ProfileCard/>,
        "payment": <SelectedProduct/>,
        2: <ProductList />,
        "home": <UserMenuAccount />,

        3: <ProductList />,

        4: <ProductList />,

        5: <ProductList />,

        6: <ProductList />,

        7: <ProductList />,
        "add_prod": <UpdateProduct />,
        "home_content": <Tabs />,
        "message_inbox": <MessageCard />,
        "Help": <PrivacyPolicy />

    };

    return (
        < >

            {/* Toggle Button */}
            <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                type="button"
                className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
                <span className="sr-only">Toggle sidebar</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                id="separator-sidebar"
                ref={sidebarRef}
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? '' : '-translate-x-full'} sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="scrollbor_hidden h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 ">

                    <ul className="space-y-2 font-medium">

                        <li>
                            <span className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <Logo/>
                            </span>
                        </li>

                        <li>
                            <span

                                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"

                                onClick={() => updateActiveTab("home") }
                            >

                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 576 512">
                                    <path d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Accueil</span>

                                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>

                            </span>
                        </li>

                        <li>

                            <span

                                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"

                                onClick={() => updateActiveTab("message_inbox")}
                            >
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>

                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>

                            </span>

                        </li>

                        <li>
                            <span

                                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"

                                onClick={() => updateActiveTab("add_prod")}
                            >
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 24">
                                    <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd" />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Créer</span>

                            </span>
                        </li>
       
                    </ul>

                    <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700 cursor-pointer">

                        <li>
                            <span className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 17 20">
                                    <path d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z" />
                                </svg>

                                <span className="ms-3">Upgrade to Pro</span>

                            </span>
                        </li>

                    </ul>

                    <ul className=" mt-1 space-y-1 font-medium border-t border-gray-200 dark:border-gray-700">

                        {menuItems.map(({ name, to, svg, id }, index) => (

                            <li key={index}>

                                <div className="  flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    {svg}
                                    {to ? (
                                        <button
                                            type="button"
                                            role="tab"
                                            aria-selected={current === id}
                                            aria-controls={`${id}-tab`}
                                            id={`${id}-tab-button`}
                                            onClick={() => {
                                                updateActiveTab(id);;
                                            }}
                                            className={`cursor-pointer ml-3 inline-block px-1 py-3 border-b-2 rounded-t-md transition-colors duration-300 
                                                    ${current === id
                                                    ? 'border-b-purple-600 text-purple-600 dark:border-b-purple-500 dark:text-purple-500'
                                                    : 'border-b-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                                } focus:outline-none`}
                                        >
                                            {name}
                                        </button>
                                    ) : (
                                        <span className="ml-3">{name}</span>
                                    )}
                                </div>
                            </li>

                        ))}
                    </ul>

                </div>
            </aside>

            <div className="p-0 m-0  sm:ml-64 h-screen">
         
                <div className="p-0 m-0 border-2 border-white-200 border-white rounded-lg dark:border-gray-700 ">

                    <div className="grid  gap-0 ">
       
                        <div className="flex items-center justify-end h-22 rounded-sm">

                            <AccountDropdown3 />

                        </div>

                    </div>

                    {!current && children}

                    <section

                        id={`${current}-tab`}
                        role="tabpanel"

                        aria-labelledby={`${current}-tab-button`}

                        className="mb-5 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full h-full pb-1 p-1"

                    >
                        {tabContent[current]}  


                    </section>
                    
                </div>
            </div>

        </>
    )
}

export default VertcalNavbar;


export const UserMenuAccount = () => {

    return (

        <> <Tabs/> </>
    )
}


export const SelectedProduct = () => {
    return (
         <ProductTable /> 
    )
}

export const ProductList = () => {

    return (
        <><GridLayoutProduct /> <GridProductDefault /></>
    )
}
