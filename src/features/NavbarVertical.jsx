import ProductTable from "./ListProductShoppingCart";
import PrivacyPolicy from "./PrivacyPolicy";
import { useEffect, useRef, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentNav } from "../slices/navigateSlice";
import { updateCompteUser, updateUserData } from "../slices/authSlice";
import ProfileCard from "./ProfilUser";
import UpdateProduct from "./UpdateProduct";
import Tabs from "./DashbordProfileUser";
import api from "../services/Axios";
import Logo from "../components/LogoApp";
import GridLayoutProduct from "./GridLayoutProducts";
import GridProductDefault from "./GridProductDefaultSize";
import AccountDropdown3 from "../components/DropDownAccount";
import { lesAccount, menuItems } from "../components/MenuItem";
import ChatLayout from "../layouts/ChatLayout";
import { addRoom } from "../slices/chatSlice";


const VertcalNavbar = ({ children }) => {

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const [dataProducts, setProducts] = useState(false);

    const dispatch = useDispatch();

    const currentNav = useSelector(state => state.navigate.currentNav);

    const allRooms = useSelector(state => state.chat.currentChats)

    const currentUser = useSelector(state => state.auth.user)

    const sidebarRef = useRef();

    // 🔎 Fetch Rooms
    useEffect(() => {

        const fetchRooms = async () => {

            try {
                const { data = [] } = await api.get("/rooms/");

                const userRooms = data.filter(

                    room =>
                        room?.current_receiver === currentUser?.id ||

                        room?.current_owner === currentUser?.id
                );

                userRooms.forEach(room => dispatch(addRoom(room)));

            } catch (error) {

                console.error("Erreur lors de la récupération des rooms :", error);
            }
        };

        fetchRooms();

    }, [currentUser?.id, dispatch]);


    // 🔎 Fetch Produits d'une catégorie
    const getProductFilter = async url => {

        try {

            const response = await api.get(url);

            setProducts(response?.data);

        } catch (err) {

            console.error("Erreur lors de la récupération des produits :", err);
        }
    };

    // 🔄 Mise à jour de l’onglet actif
    const updateActiveTab = (tab, to = null) => {

        if (to) getProductFilter(to);

        dispatch(setCurrentNav(tab));

        lesAccount(); // ⚠️ Potentiellement inutile ici
    };

    //const { currentUser } = useAuth()
    const currentUserEmail = useSelector((state) => state.auth.user)

    // 🔎 Fetch infos utilisateur (clients)
    useEffect(() => {

        const fetchClient = async () => {

            try {

                const response = await api.get(`/clients/?email=${currentUserEmail?.email}`);

                const userData = response?.data?.[0];

                if (userData) dispatch(updateUserData(userData));

                else console.warn("Utilisateur non trouvé :", currentUserEmail?.email);

            } catch (error) {

                console.error("Erreur lors de la récupération du client :", error);
            }
        };

        fetchClient();

    }, [currentUserEmail?.email, currentUser?.id, dispatch]);


    // 🔎 Fetch compte utilisateur
    useEffect(() => {

        const fetchCompte = async () => {

            if (!currentUserEmail?.id) return;

            try {

                const { data } = await api.get('/comptes/');

                const userAccount = data.find(acc => acc?.user === currentUserEmail.id);

                if (userAccount) dispatch(updateCompteUser(userAccount));

            } catch (error) {

                console.error("Erreur lors de la récupération des comptes :", error);
            }
        };

        fetchCompte();

    }, [currentUserEmail, dispatch]);


    // 📦 Click en dehors de la sidebar
    useEffect(() => {

        const handleClickOutside = (e) => {

            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {

                setSidebarOpen(false);
            }
        };

        if (isSidebarOpen) {

            document.addEventListener("mousedown", handleClickOutside);

            return () => document.removeEventListener("mousedown", handleClickOutside);
        }

    }, [isSidebarOpen]);


    // 🔄 Contenu dynamique selon l’onglet
    const tabContent = {

        home: <ProductList />,

        all_products: <ProductList />,

        user_profil: <ProfileCard />,

        user_profil_product: <ProfileCard />,

        payment: <SelectedProduct />,

        dashboard: <UserMenuAccount />,

        add_product: <UpdateProduct />,

        home_content: <Tabs />,

        message_inbox: <ChatLayout />,

        Help: <PrivacyPolicy />,

        ...[
            'jouets', 'sacs', 'materiels', 'electronique', 'habits',
            'livres', 'Jeux_vidéo', 'Meubles', 'Véhicules',
            'Fournitures_scolaires', 'divers'
        ].reduce((acc, key) => {
            acc[key] = <GridProductDefault data={dataProducts} />;
            return acc;
        }, {})
    };



    return (

        <>

            {/* Toggle Button */}
            <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                type="button"
                className="inline-flex items-center mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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

                className={`fixed top-0 left-0 z-10 w-64 h-screen transition-transform ${isSidebarOpen ? '' : '-translate-x-full'} sm:translate-x-0`}

                aria-label="Sidebar"
            >
                <div className="scrollbor_hidden h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 " style={{
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)"
                }}>

                    <ul className="space-y-2 ">

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

                                {currentUser?.is_pro && <span className="inline-flex items-center justify-center px-2 ms-3 text-sm  text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>}

                            </span>

                        </li>

                        <li>

                            <span

                                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"

                                onClick={() => updateActiveTab("message_inbox")}
                            >
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">

                                    <path fillRule="evenodd" d="M3.559 4.544c.355-.35.834-.544 1.33-.544H19.11c.496 0 .975.194 1.33.544.356.35.559.829.559 1.331v9.25c0 .502-.203.981-.559 1.331-.355.35-.834.544-1.33.544H15.5l-2.7 3.6a1 1 0 0 1-1.6 0L8.5 17H4.889c-.496 0-.975-.194-1.33-.544A1.868 1.868 0 0 1 3 15.125v-9.25c0-.502.203-.981.559-1.331ZM7.556 7.5a1 1 0 1 0 0 2h8a1 1 0 0 0 0-2h-8Zm0 3.5a1 1 0 1 0 0 2H12a1 1 0 1 0 0-2H7.556Z" clipRule="evenodd" />

                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Messages</span>

                                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm  text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">

                                    {allRooms.length}

                                </span>

                            </span>

                        </li>

                        <li>
                            <span

                                className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer"

                                onClick={() => updateActiveTab("add_product")}
                            >
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 24">

                                    <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd" />

                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap">Créer</span>

                            </span>
                        </li>
       
                    </ul>

                    {
                        (!currentUser?.is_pro ) &&
                        <ul className="pt-4 mt-4 space-y-2  border-t border-gray-200 dark:border-gray-700 cursor-pointer">

                            <li>
                                <span className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                                    <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 17 20">

                                        <path d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z" />

                                    </svg>

                                    <span className="ms-3 " onClick={()=>alert("SERVICE PAS ENCORE DISPONIBLE") }>Upgrade to Pro</span>

                                </span>
                            </li>

                        </ul>
                    }

                    <ul
                        className="scrollbor_hidden h-full lg:h-[300px] py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800  mt-1 space-y-1  border-t border-gray-200 dark:border-gray-700"

                        style={{
                            backgroundColor: "var(--color-bg)",
                            color: "var(--color-text)"
                        }}
                    >

                        {menuItems.map(({ name, to, svg, id }, index) => (

                            <li key={index}>

                                <div className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                                    {svg}

                                    {to ? (
                                        <button
                                            type="button"
                                            role="tab"
                                            aria-selected={currentNav === id}
                                            aria-controls={`${id}-tab`}
                                            id={`${id}-tab-button`}
                                            onClick={() => {
                                                updateActiveTab(id,to);
                                            }}
                                            className={`cursor-pointer ml-3 inline-block px-1 py-3 border-b-2 rounded-t-md transition-colors duration-300 
                                                    ${currentNav === id
                                                    ? 'border-b-purple-600 text-purple-600 dark:border-b-purple-500 dark:text-purple-500'
                                                    : 'border-b-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                                } focus:outline-none`}
                                        >

                                            {name}

                                        </button>
                                    )
                                    :
                                    (
                                        <span className="ml-3">
                                            {name}
                                        </span>
                                    )}

                                </div>
                            </li>

                        ))}
                    </ul>

                    <div className="absolute bottom-2  flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                        <svg className="shrink-0 w-5 h-5 ...">

                            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">

                                <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />

                            </svg>

                        </svg>

                        <button
                            type="button"
                            role="tab"
                            aria-selected={currentNav === 9}
                            aria-controls={`${9}-tab`}
                            id={`${9}-tab-button`}
                            onClick={() => {
                                updateActiveTab(9);;
                            }}
                            className={`cursor-pointer ml-3 inline-block px-1 py-3 border-b-2 rounded-t-md transition-colors duration-300 
                                    ${currentNav === 9
                                    ? 'border-b-purple-600 text-purple-600 dark:border-b-purple-500 dark:text-purple-500'
                                    : 'border-b-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                } focus:outline-none`}
                        >
                            Help..
                        </button>

                    </div>

                </div>
            </aside>

            <div className="p-0 m-0  sm:ml-64 h-full" style={{
                backgroundColor: "var(--color-bg)",
                color: "var(--color-text)"
            }}>

                <div
                    className="p-0 m-0 border-0  border-white rounded-lg dark:border-gray-700  h-full"

                    style={{
                        backgroundColor: "var(--color-bg)",
                        color: "var(--color-text)"
                    }}
                >

                    <div className="grid  gap-0 ">
       
                        <div className="flex items-center justify-end h-22 rounded-sm">

                            <AccountDropdown3/>

                        </div>

                    </div>

                    {!currentNav && children}

                    <section

                        id={`${currentNav}-tab`}
                        role="tabpanel"

                        aria-labelledby={`${currentNav}-tab-button`}

                        className="bg-white dark:bg-gray-800 rounded-lg w-auto h-full"

                        style={{
                            backgroundColor: "var(--color-bg)",
                            color: "var(--color-text)"
                        }}

                    >
                        {tabContent[currentNav]}  

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

         <ProductTable/> 
    )
}

export const ProductList = () => {

    return (

        <>
            <GridLayoutProduct />
            
        </>
    )
}



