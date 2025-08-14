
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentNav } from "../slices/navigateSlice";
import { updateCompteUser, updateUserData } from "../slices/authSlice";
import api from "../services/Axios";
import Logo from "../components/LogoApp";
import { menuItems } from "../components/MenuItem";
import { addRoom } from "../slices/chatSlice";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router";
import AccountDropdownUserProfil from "../components/DropDownAccount";


const VertcalNavbar = ({ children }) => {

    const { t } = useTranslation();

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const dispatch = useDispatch();

    let navigate = useNavigate();

    const currentNav = useSelector(state => state.navigate.currentNav);

    const allRooms = useSelector(state => state.chat.currentChats)

    const currentUser = useSelector(state => state.auth.user)

    const sidebarRef = useRef();

    //const { currentUser } = useAuth()
    const currentUserEmail = useSelector((state) => state.auth.user)

    // 🔎 Fetch Rooms
    useEffect(() => {

        const fetchRooms = async () => {

            try {
                const { data = [] } = await api.get("/rooms/");

                const userRooms = data?.filter(

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


    return (

        <div

            className="overflow-y-auto h-full"

            style={
                {
                    marginBottom: "50px",

                    paddingBottom: "30px"
                }
            }
        >

            {/* Toggle Button */}
            <button

                onClick={() => setSidebarOpen(!isSidebarOpen)}

                type="button"

                className="inline-flex items-center mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >

                <span className="sr-only">...</span>

                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">

                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>

                </svg>

            </button>

            {/* Sidebar */}
            <aside

                id="separator-sidebar"

                ref={sidebarRef}

                className={`bg-white fixed top-0 left-0 z-[40] w-64 h-full transition-transform ${isSidebarOpen ? '' : '-translate-x-full'} sm:translate-x-0`}

                aria-label="Sidebar"
            >
                <div

                    className="scrollbor_hidden h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800"

                    style={

                        {
                            backgroundColor: "var(--color-bg)",

                            color: "var(--color-text)"
                        }
                    }
                >

                    <ul className="space-y-2 ">

                        <li>

                            <span className="flex items-center p-text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group mb-5">

                                <Logo />

                            </span>

                        </li>

                        <li>
                            <button

                                className={`w-full flex items-center justify-between text-left gap-x-3 p-2 w-full text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer rounded-md ${(currentNav === "account_home") && "bg-gray-100"}`}

                                onClick={

                                    () => {

                                        navigate("/account_home");

                                        dispatch(setCurrentNav("account_home"));
                                    }
                                }
                            >
                                <>
                                    {currentUser?.image ? (

                                        <div className="relative h-[30px] w-[30px] rounded-full shrink-0">

                                            <img
                                                src={currentUser.image}
                                                alt="avatar"
                                                title={currentUser.email}
                                                className="h-full w-full rounded-full object-cover object-center"
                                            />

                                            {
                                                currentUser?.is_connected && (

                                                    <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
                                                )
                                            }

                                        </div>

                                    ) : (

                                        <div className="relative h-[30px] w-[30px] rounded-full shrink-0" title={currentUser?.email}>

                                            <svg
                                                className="w-[26px] h-[26px] text-gray-800 dark:text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="0.8"
                                                    d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                />

                                            </svg>

                                            {
                                                currentUser?.is_connected && (
                                                    <span className="absolute -right-0.5 -top-0.5 block h-[14px] w-[14px] rounded-full border-[2.3px] border-white bg-[#219653] dark:border-dark"></span>
                                                )
                                            }
                                        </div>
                                    )}

                                    <span className="text-sm font-medium text-left ml-0">{currentUser?.nom}</span>
                                </>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">

                                    {
                                        currentUser?.is_pro && (
                                            <span

                                                className="shadow-lg inline-flex items-center justify-center px-2 text-xs text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"

                                                style={{
                                                    backgroundColor: "var(--color-bg)",
                                                    color: "var(--color-text)"
                                                }}
                                            >
                                                Pro
                                            </span>
                                        )
                                    }

                                </div>

                            </button>
                        </li>

                        <li>

                            <button

                                className={`w-full flex items-center justify-start text-left p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer rounded-md ${(currentNav === "message_inbox") && "bg-gray-100"}`}

                                onClick={() => { navigate("/message_inbox"); dispatch(setCurrentNav("message_inbox")) }}
                            >
                                {
                                    (currentNav === "message_inbox") ?
                                        <svg className="shadow-lg w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M4 3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h1v2a1 1 0 0 0 1.707.707L9.414 13H15a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4Z" clipRule="evenodd" />
                                            <path fillRule="evenodd" d="M8.023 17.215c.033-.03.066-.062.098-.094L10.243 15H15a3 3 0 0 0 3-3V8h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-1v2a1 1 0 0 1-1.707.707L14.586 18H9a1 1 0 0 1-.977-.785Z" clip-rule="evenodd" />
                                        </svg>

                                        :
                                        <svg className="shadow-lg  w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 17h6l3 3v-3h2V9h-2M4 4h11v8H9l-3 3v-3H4V4Z" />
                                        </svg>
                                }

                                <span className="flex-1 ms-3 whitespace-nowrap">{t('AccountPage.messages')}</span>

                                <span

                                    className="shadow-lg inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm  text-blue-900 bg-blue-50 rounded-full dark:bg-blue-900 dark:text-blue-300"

                                    style={{
                                        backgroundColor: "var(--color-bg)",
                                        color: "var(--color-text)"
                                    }}
                                >

                                    {allRooms.length}

                                </span>

                            </button>

                        </li>

                        <li>

                            <button

                                className={`w-full flex items-center justify-start text-left p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer rounded-md ${(currentNav === "add_product") && "bg-gray-100"}`}

                                onClick={() => { navigate("/add_product"); dispatch(setCurrentNav("add_product")) }}
                            >
                                {
                                    (currentNav === "add_product") ?
                                        <svg className="shadow-lg  shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 24">

                                            <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4.243a1 1 0 1 0-2 0V11H7.757a1 1 0 1 0 0 2H11v3.243a1 1 0 1 0 2 0V13h3.243a1 1 0 1 0 0-2H13V7.757Z" clipRule="evenodd" />

                                        </svg>
                                        :
                                        <svg className="shadow-lg  w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                }

                                <span className="flex-1 ms-3 whitespace-nowrap">{t('AccountPage.create')}</span>

                            </button>

                        </li>

                        <li>

                            <button

                                onClick={() => { navigate("/user_blogs"); dispatch(setCurrentNav("user_blogs")) }}

                                className={`w-full flex items-center justify-start text-left p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer rounded-md ${(currentNav === "user_blogs") && "bg-gray-100"}`}                            >

                                <div className="flex gap-2">

                                    {
                                        (currentNav === "user_blogs") ?
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path fillRule="evenodd" d="M14 4.182A4.136 4.136 0 0 1 16.9 3c1.087 0 2.13.425 2.899 1.182A4.01 4.01 0 0 1 21 7.037c0 1.068-.43 2.092-1.194 2.849L18.5 11.214l-5.8-5.71 1.287-1.31.012-.012Zm-2.717 2.763L6.186 12.13l2.175 2.141 5.063-5.218-2.141-2.108Zm-6.25 6.886-1.98 5.849a.992.992 0 0 0 .245 1.026 1.03 1.03 0 0 0 1.043.242L10.282 19l-5.25-5.168Zm6.954 4.01 5.096-5.186-2.218-2.183-5.063 5.218 2.185 2.15Z" clip-rule="evenodd" />
                                            </svg>
                                            :
                                            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28" />
                                            </svg>
                                    }

                                    <>{t("blogs")}</>

                                </div>

                            </button>

                        </li>

                        <li>

                            <button

                                onClick={() => { navigate("/dashboard"); dispatch(setCurrentNav("dashboard")) }}

                                className={`w-full flex items-center justify-start text-left p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group cursor-pointer rounded-md ${(currentNav === "dashboard") && "bg-gray-100"}`}                            >

                                <div className="flex gap-2">

                                    {
                                        (currentNav === "dashboard") ?
                                            <svg className="shadow-lg  w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.045 3.007 12.31 3a1.965 1.965 0 0 0-1.4.585l-7.33 7.394a2 2 0 0 0 0 2.805l6.573 6.631a1.957 1.957 0 0 0 1.4.585 1.965 1.965 0 0 0 1.4-.585l7.409-7.477A2 2 0 0 0 21 11.479v-5.5a2.972 2.972 0 0 0-2.955-2.972Zm-2.452 6.438a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                                            </svg>
                                            :
                                            <svg className="shadow-lg  w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z" />
                                            </svg>
                                    }

                                    <>{t("activity")}</>

                                </div>

                            </button>

                        </li>

                    </ul>

                    {
                        (!currentUser?.is_pro) &&
                        <ul className="pt-4 mt-4 space-y-2  border-t border-gray-200 dark:border-gray-700 cursor-pointer">

                            <li>
                                <span className="flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                                    <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 17 20">

                                        <path d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z" />

                                    </svg>

                                    <span className="ms-3 " onClick={() => alert("SERVICE PAS ENCORE DISPONIBLE")}>{t('AccountPage.upgrade')}</span>

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

                                    {
                                        !(currentNav === id) ?
                                            <svg className="shadow-lg w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15.583 8.445h.01M10.86 19.71l-6.573-6.63a.993.993 0 0 1 0-1.4l7.329-7.394A.98.98 0 0 1 12.31 4l5.734.007A1.968 1.968 0 0 1 20 5.983v5.5a.992.992 0 0 1-.316.727l-7.44 7.5a.974.974 0 0 1-1.384.001Z" />
                                            </svg>
                                            :
                                            <svg className="shadow-lg  w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.045 3.007 12.31 3a1.965 1.965 0 0 0-1.4.585l-7.33 7.394a2 2 0 0 0 0 2.805l6.573 6.631a1.957 1.957 0 0 0 1.4.585 1.965 1.965 0 0 0 1.4-.585l7.409-7.477A2 2 0 0 0 21 11.479v-5.5a2.972 2.972 0 0 0-2.955-2.972Zm-2.452 6.438a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
                                            </svg>
                                    }

                                    {to ? (
                                        <button
                                            type="button"
                                            role="tab"
                                            aria-selected={currentNav === id}
                                            aria-controls={`${id}-tab`}
                                            id={`${id}-tab-button`}
                                            onClick={
                                                () => {
                                                    dispatch(setCurrentNav(`${id}`));
                                                    navigate(`/${id}`)
                                                }
                                            }

                                            className={`cursor-pointer ml-3 inline-block px-1 py-3 border-b-2 rounded-t-md transition-colors duration-300 
                                                    ${(currentNav === id)
                                                    ? 'border-b-gray-600 text-gray-600 dark:border-b-gray-500 dark:text-gray-500'
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

                    <div className=" flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                        {
                            !(currentNav === "help") ?
                                <svg className=" shadow-lg  w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M14 17h6m-3 3v-6M4.857 4h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 9.143V4.857C4 4.384 4.384 4 4.857 4Zm10 0h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857h-4.286A.857.857 0 0 1 14 9.143V4.857c0-.473.384-.857.857-.857Zm-10 10h4.286c.473 0 .857.384.857.857v4.286a.857.857 0 0 1-.857.857H4.857A.857.857 0 0 1 4 19.143v-4.286c0-.473.384-.857.857-.857Z" />
                                </svg>
                                :
                                <svg className="shadow-lg  w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M4.857 3A1.857 1.857 0 0 0 3 4.857v4.286C3 10.169 3.831 11 4.857 11h4.286A1.857 1.857 0 0 0 11 9.143V4.857A1.857 1.857 0 0 0 9.143 3H4.857Zm10 0A1.857 1.857 0 0 0 13 4.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 21 9.143V4.857A1.857 1.857 0 0 0 19.143 3h-4.286Zm-10 10A1.857 1.857 0 0 0 3 14.857v4.286C3 20.169 3.831 21 4.857 21h4.286A1.857 1.857 0 0 0 11 19.143v-4.286A1.857 1.857 0 0 0 9.143 13H4.857ZM18 14a1 1 0 1 0-2 0v2h-2a1 1 0 1 0 0 2h2v2a1 1 0 1 0 2 0v-2h2a1 1 0 1 0 0-2h-2v-2Z" clip-rule="evenodd" />
                                </svg>
                        }

                        <button
                            type="button"
                            role="tab"
                            aria-selected={currentNav === 9}
                            aria-controls={`${9}-tab`}
                            id={`${9}-tab-button`}
                            onClick={() => { navigate(`/help`); dispatch(setCurrentNav(`help`)) }}
                            className={`cursor-pointer ml-3 inline-block px-1 py-3 border-b-2 rounded-t-md transition-colors duration-300 
                                    ${currentNav === 9
                                    ? 'border-b-purple-600 text-purple-600 dark:border-b-purple-500 dark:text-purple-500'
                                    : 'border-b-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                } focus:outline-none`}
                        >
                            {t('AccountPage.help')} - Support

                        </button>

                    </div>

                </div>

            </aside>

            <div

                className="p-0 m-0  sm:ml-64 h-full"

                style={{
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)"
                }}
            >

                <div
                    className="p-0 m-0 border-0  border-white rounded-lg dark:border-gray-700"

                    style={{
                        backgroundColor: "var(--color-bg)",
                        color: "var(--color-text)"
                    }}
                >

                    <section className="flex items-center justify-end h-auto mb-6 rounded-sm">

                        <AccountDropdownUserProfil/>

                    </section>

                    <section

                        id={`${currentNav}-tab`}

                        role="tabpanel"

                        aria-labelledby={`${currentNav}-tab-button`}

                        className="dark:bg-gray-800 rounded-lg w-auto sm:mb-[30px] sm:pb-[50px] sm:z-[1000] pt-6 sm:pt-2 p-0"

                        style={

                            {
                                backgroundColor: "var(--color-bg)",

                                color: "var(--color-text)"
                            }
                        }

                    > 
                        {children}

                    </section>

                </div>

            </div>

        </div>
    )
}

export default VertcalNavbar;




