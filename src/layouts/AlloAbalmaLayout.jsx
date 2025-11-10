
import React, { useEffect, useRef, useState } from "react";
import { ALLO_ABALMA_CATEGORIES, ALLO_ABALMA_FEATURES_LIST, HELLO_ABALMA, offreurs } from "../utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { addCurrentChat } from "../slices/chatSlice";
import { useDispatch} from 'react-redux';
import SubscriptionsPage from "../pages/SubscriptionCard";


const HomeAbalmaLayout= ({ children }) => {

    //const { t } = useTranslation();

    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const [handleButton, setHandleButton] = useState("home");

    const sidebarRef = useRef();

    const dispatch = useDispatch();

    const handleBtnClicked = (btn) => {
        setHandleButton(btn)
    }

    useEffect(

        () => {

            dispatch(addCurrentChat(offreurs))

        }, [handleButton, dispatch]
    )

    return (

        <div

            className="overflow-y-auto h-full pt-2"

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

                className=" z-8 fixed top-0 right-2 inline-flex items-center ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-100 dark:text-gray-100 dark:hover:bg-gray-100 dark:focus:ring-gray-50"
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

                className={`bg-non fixed top-0 left-0 z-[40] w-64 h-full transition-transform ${isSidebarOpen ? '' : '-translate-x-full'} sm:translate-x-0`}

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

                            <span className="flex items-center p-text-gray-900 rounded-lg dark:text-white  group mb-5">

                                <strong className="text-[25px]"> HelloAbalma</strong>

                            </span>

                        </li>

                    </ul>

                    <ul
                        className="scrollbor_hidden h-full lg:h-[80dvh] py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800  mt-1 space-y-1  border-t border-gray-200 dark:border-gray-700 hover:bg-gray-500 cursor-pointer"

                        style={{
                            backgroundColor: "var(--color-bg)",
                            color: "var(--color-text)"
                        }}
                    >
                        {
                            Object.values(ALLO_ABALMA_CATEGORIES).map((item, index) => (
                                <li key={index}>
                                    <span className="flex items-center text-gray-900 rounded-lg dark:text-white group mb-5">
                                        {item?.icon} {item?.text}
                                    </span>
                                </li>
                            ))

                        }

                    </ul>

                    <div className=" flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                        {/*<img src="" alt=" logo" className="rounded-full bg-gray-800 h-8 w-8" />*/}

                    </div>

                </div>

                <div className="absolute bottom-2 flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">

                    <img src="" alt=" logo" className="rounded-full bg-gray-800 h-8 w-8" />

                </div>

            </aside>

            <div

                className="p-0 m-0  sm:ml-64 h-full"

                style={{
                    backgroundColor: "var(--color-bg)",
                    color: "var(--color-text)"
                }}
            >

                <span className="flex">

                    <ul className="flex w-full gap-6 items-center justify-center">
                        {
                            Object.values(HELLO_ABALMA).map((item, index) => (

                                <li key={index}>

                                    {
                                        (item?.index === "abonnements")?
                                        <NavLink
                                            to="/home"
                                            className={

                                                ({ isActive }) =>
                                                    `cursor-pointer flex flex-col items-center justify-center 
                                                    text-gray-100 rounded-lg dark:text-white group mb-5 gap-0 space-y-0 text-[12px] p-1
                                                    ${isActive
                                                    ? 'bg-gray-100 border-[#1B44C8] text-white'
                                                    : 'bg-primary border-primary text-grey hover:bg-blue-50'
                                                }`
                                            }
                                        >
                                            { item?.logo}
                                            <Popover

                                              trigger={item?.index}

                                            >
                                               <SubscriptionsPage/>

                                            </Popover>

                                         </NavLink>
                                         :
                                        <NavLink
                                            to={`/${item?.index}`}
                                            onClick={() => handleBtnClicked(item?.index) }
                                            className={({isActive})=>
                                                `cursor-pointer flex flex-col items-center justify-center 
                                                text-gray-100 rounded-lg dark:text-white group mb-5 gap-0 space-y-0 text-[12px] p-1
                                                ${isActive
                                                    ? 'bg-blue-100 border-[#1B44C8] text-white'
                                                : 'bg-primary border-primary text-grey hover:bg-blue-50'
                                            }`
                                            }>
                                            {item?.logo}
                                            {item?.text}
                                        </NavLink> 

                                    }

                                </li>
                            ))

                        }
                    </ul>

                    <ul className="hidden md:flex lg:flex z-[9999]">

                        <DropdownMenu />

                    </ul>

                </span>

                <div className="grid md:grid-cols-2 lg:grid-cols-2 ">

                    {
                        (handleButton === "messages") ?

                        <>
                            <div className="flex flex-col  h-[88dvh] overflow-y-auto scrollbor_hidden">

                                    <div className="flex items-center gap-0 mx-[40px] mb-3">

                                        <input
                                            value=""
                                            onChange={e => alert("Chercher un fournisseur ")}
                                            onKeyDown={e => e.key === "Enter"}
                                            placeholder="Recherche par nom utilisateur..."
                                            className="bg-none flex-1 px-3 py-2 border-r-0 border border-gray-300 rounded-e-none rounded-xl text-sm focus:outline-none focus:ring-0 "
                                        />

                                        <button
                                            onClick={() => alert("Button cliecked")}
                                            className="rounded-e-full border-l-0 border border-gray-300 px-5 py-2 text-base  text-white transition bg-none from-purple-300 to-blue-300 hover:bg-gradient-to-br hover:from-purple-50 "
                                            aria-label="Envoyer"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z"
                                                />
                                            </svg>

                                        </button>

                                    </div>
                               <OffreursCarouselChat offreurs={offreurs} />
                            </div>

                            <div className="flex flex-col">
                                <ChatHelloAbalma />
                            </div>
                        </>

                        :
                        <>
                            <div className="flex flex-col">
                                {
                                    (handleButton==="home" && children) ?
                                        <>
                                            <CarteAnnonce/>
                                            <AnnonceForm/>
                                        </>
                                        :
                                        <>

                                        </>

                                }
                                {children}
                            </div>
                            <div className="z-0 hidden lg:flex md:flex mg:flex-col  md:flex-col overflow-y-auto scrollbor_hidden h-[95dvh] sticky top-2 pb-[12dvh] ">
                                <DemandePubliqueForm />
                            </div>
                        </>
                    }
                </div>
                         
            </div>

        </div>
    )
}

export default HomeAbalmaLayout;


function DropdownMenu() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef();

    // Fermer le menu quand on clique à l’extérieur
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            {/* Bouton */}
            <button
                onClick={() => setOpen((prev) => !prev)}
                type="button"
                className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
                <svg
                    className="w-3.5 h-3.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 4 15"
                >
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                </svg>
            </button>

            {/* Menu déroulant */}
            {open && (
                <div className="absolute right-0 z-[9999] mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-100 dark:bg-gray-700 dark:divide-gray-600">

                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 g">
                        {
                            Object.values(ALLO_ABALMA_FEATURES_LIST).map(

                                (item, _) => (
                                    <li>
                                        <span
                                            href="#"
                                            className="whitespace-nowrap block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                        >
                                            {item?.title}
                                        </span>
                                    </li>
                                )
                            )
                        }
                    </ul>

                    <div className="py-2">
                        <span
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                        >
                            Lien séparé
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}


function AnnonceCard({ data }) {

    return (

        <div className="border-gray-100 rounded-xl shadow-sm p-1 bg-white dark:bg-gray-800  w-full">

            {/* Demande privée / publique */}
            <div className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                <span className="text-gray-700 dark:text-gray-300">
                    {data.type === "privee" ? "🔒 Demande privée" : "🌍 Demande publique"}
                </span>
                <span className="ml-auto text-xs text-gray-400">Posté {data.date}</span>
            </div>

            {/* Profil */}
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {data.nom.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                        {data.nom}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Besoin : {data.besoin}
                    </p>
                    <p className="text-sm text-gray-500">
                        {data.localisation} – {data.distance} km
                    </p>
                </div>
            </div>

            {/* Offreur contacté */}
            <div className="mt-4 text-sm text-gray-700 dark:text-gray-200 w-full">

                <p className="font-medium mb-2">
                    {offreurs.length} offreur{offreurs.length > 1 && "s"} contacté{offreurs.length > 1 && "s"}
                </p>

                <OffreursCarousel offreurs={offreurs} />

            </div>
        </div>
    );
}

function AnnonceForm() {
    const [form, setForm] = useState({
        type: "privee",
        nom: "",
        besoin: "",
        localisation: "",
        distance: "",
        date: "hier",
        offreurs: []
    });

    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Exemple d’un offreur fictif
        setForm({
            ...form,
            offreurs: [
                {
                    nom: "Fatoumata B. (SEIBA CLEAN S)",
                    activite: "Nettoyage entretien",
                    ville: "Évry-Courcouronnes",
                    distance: 1.3,
                    enLigne: "12:32",
                    note: 5,
                    autoEntrepreneur: true,
                    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"
                }
            ]
        });
        setSubmitted(true);
    };

     return (

        <div className="max-w-md mx-auto mt-6 w-full">

            {!submitted ? (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm"
                >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Créer une demande
                    </h2>

                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                    >
                        <option value="privee">Demande privée</option>
                        <option value="publique">Demande publique</option>
                    </select>

                    <input
                        type="text"
                        name="nom"
                        placeholder="Nom"
                        value={form.nom}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="besoin"
                        placeholder="Besoin (ex: Ménage)"
                        value={form.besoin}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="localisation"
                        placeholder="Localisation (ex: Dakar, Pikine...)"
                        value={form.localisation}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                        required
                    />
                    <input
                        type="number"
                        name="distance"
                        placeholder="Distance (en km)"
                        value={form.distance}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-lg"
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        Publier
                     </button>

                </form>
            ) : (
                <AnnonceCard data={form} />
            )}
        </div>
    );
}

function DemandePubliqueForm() {

    const [form, setForm] = useState({
        besoin: "",
        photos: [],
        reservePro: false,
        adresse: "",
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setForm((prev) => ({ ...prev, photos: files }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Demande envoyée ✅");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto bg-white dark:bg-gray-800 shadow-md rounded-2xl p-5 space-y-4"
        >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                🟢 Demande publique
            </h2>

            {/* Champ texte */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Décrivez votre besoin
                </label>
                <textarea
                    name="besoin"
                    value={form.besoin}
                    onChange={(e) => setForm({ ...form, besoin: e.target.value })}
                    placeholder="Bonjour,"
                    rows={3}
                    maxLength={250}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p className="text-xs text-gray-400 text-right mt-1">
                    {form.besoin.length}/250 caractères
                </p>
            </div>

            {/* Upload photos */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ajoutez des photos
                </label>
                <p className="text-xs text-gray-500 mb-2">
                    Augmentez vos chances de faire affaire de 25% en illustrant votre
                    besoin.
                </p>
                <div className="flex gap-3">
                    {[0, 1, 2].map((i) => (
                        <label
                            key={i}
                            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            {form.photos[i] ? (
                                <img
                                    src={URL.createObjectURL(form.photos[i])}
                                    alt="preview"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="gray"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 4v16m8-8H4"
                                    />
                                </svg>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Switch réservé aux pros */}
            <div className="flex items-start justify-between mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-1">
                        🔒 Réservé aux pros
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 max-w-xs">
                        Obtenez les garanties d’un professionnel : certifications, assurance,
                        facture… Seuls les auto-entrepreneurs pourront répondre.
                    </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={form.reservePro}
                        onChange={() =>
                            setForm((prev) => ({ ...prev, reservePro: !prev.reservePro }))
                        }
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-green-500"></div>
                </label>
            </div>

            {/* Adresse */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Adresse
                </label>
                <input
                    type="text"
                    name="adresse"
                    value={form.adresse}
                    onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                    placeholder="Ex: 1 Villa Auguste Vermorel, 91000 Évry-Courcouronnes"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                />
            </div>

            {/* Délai + bouton */}
            <div className="text-xs text-gray-500 dark:text-gray-400">
                ⏱️ Délai estimé avant première réponse : -
            </div>

            <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
                Poster ma demande
            </button>
        </form>
    );
}

function CarteAnnonce({
    data = {
        author: "Helene D.",
        avatar: null, // URL ou null pour initiales
        text: "Bonjour, je cherche un élagueur pour rabaisser mon bouleau. secteur evry bras de fer. à bientôt",
        image: "/mnt/data/capture___222.PNG",
        location: "Évry-Courcouronnes (Bras de Fer-Tourelles) - 900 m",
        budget: "300€",
        likes: 1,
        responses: 13,
        addedImages: 1,
    },
}) {
    const dataSender = [
        { nom: "img3", logo: data?.image },
        { nom: "img2", logo: data?.image },
        { nom: "img1", logo: data?.image }
    ]
    const initials = data.author
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("");

    return (
        <article className="max-w-md mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <header className="flex items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-semibold">
                    {data.avatar ? (
                        <img src={data.avatar} alt={data.author} className="w-full h-full object-cover rounded-full" />
                    ) : (
                        <span>{initials}</span>
                    )}
                </div>
                <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{data.author}</div>
                    <div className="text-xs text-gray-500">Publié • Il y a 2j</div>
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-700">…</button>
            </header>

            <p className="px-4 text-sm text-gray-800 pb-3">{data.text}</p>

            <div className="relative">
                {/*<img*/}
                {/*    src={data.image}*/}
                {/*    alt="annonce"*/}
                {/*    className="w-full h-56 object-cover sm:h-64"*/}
                {/*/>*/}
                <OffreursCarouselPictures
                    images={dataSender}
                />                {/* petit badge +1 en haut à droite */}
                <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">
                    +{dataSender?.length}
                </div>
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                    <div className="text-sm text-gray-600">{data.location}</div>
                    <div className="text-sm font-semibold text-gray-900">Budget : {data.budget}</div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 9l-2 2-2-2m6 6v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2" />
                            </svg>
                            <span>{data.likes} J'aime</span>
                        </button>

                        <button className="flex items-center gap-2 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h8m-8 4h6" />
                            </svg>
                            <span>{data.responses} réponses</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="text-sm text-gray-500 hover:text-gray-700">Recommander</button>
                        <button className="text-sm text-blue-600 font-medium">Répondre</button>
                    </div>
                </div>
            </div>
        </article>
    );
}

function OffreursCarouselChat({ offreurs }) {


    return (
        <div className="w-full max-w-md mx-auto relative">

            {/* Carte affichée */}
            {
                Object.values(offreurs).map((item,_)=>(
                   < div className="border-gray-100 rounded-lg p-3 flex items-start gap-3 hover:shadow-md transition w-full">
                    <img
                            src={item.logo}
                            alt={item.nom}
                        className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                                    {item.nom}
                            </h4>
                                {item.autoEntrepreneur && (
                                <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">
                                    Auto-entrepreneur
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                                {item.activite}
                        </p>
                        <p className="text-xs text-gray-500">
                                {item.ville} – {item.distance} km
                        </p>
                        <p className="text-xs text-gray-400">
                                En ligne à {item.enLigne}
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                                ⭐ {item.note}/5
                        </p>
                    </div>
                    </div>
                ))
            }

        </div>
    );
}

 function OffreursCarousel({ offreurs }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextCard = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === offreurs.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevCard = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? offreurs.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="w-full max-w-md mx-auto relative">

            {/* Carte affichée */}
            <div className="border-gray-100 rounded-lg p-3 flex items-start gap-3 hover:shadow-md transition w-full">
                <img
                    src={offreurs[currentIndex].logo}
                    alt={offreurs[currentIndex].nom}
                    className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                            {offreurs[currentIndex].nom}
                        </h4>
                        {offreurs[currentIndex].autoEntrepreneur && (
                            <span className="text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded-full">
                                Auto-entrepreneur
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">
                        {offreurs[currentIndex].activite}
                    </p>
                    <p className="text-xs text-gray-500">
                        {offreurs[currentIndex].ville} – {offreurs[currentIndex].distance} km
                    </p>
                    <p className="text-xs text-gray-400">
                        En ligne à {offreurs[currentIndex].enLigne}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                        ⭐ {offreurs[currentIndex].note}/5
                    </p>
                </div>
            </div>

            {/* Boutons de navigation */}
            <button
                onClick={prevCard}
                className={`absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-100 ${(offreurs.length <=1) && "hidden"}`}
            >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
                onClick={nextCard}
                className={`absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-100 ${(offreurs.length<=1) && "hidden"}`}
            >
                <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
}

function OffreursCarouselPictures({ images }) {

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextCard = () => {

        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevCard = () => {

        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (

        <div className="w-full max-w-md mx-auto relative">

            {/* Carte affichée */}
            <div className="border-gray-100 rounded-lg p-3 flex items-start gap-3 hover:shadow-md transition w-full">
                <img
                    src={images[currentIndex]?.logo}
                    alt={images[currentIndex]?.nom}
                    className="w-full h-56 object-cover sm:h-64"
                />
            </div>

            {/* Boutons de navigation */}
            <button
                onClick={prevCard}
                className={`absolute left-0 top-1/2 -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-100 ${(images?.length<=1) && "hidden"}`}
            >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <button
                onClick={nextCard}
                className={`absolute right-0 top-1/2 -translate-y-1/2 bg-gray-200 p-1 rounded-full hover:bg-gray-100 ${(images?.length<=1) && "hidden"}`}
            >
                <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
        </div>
    );
}

export const HandleDataComponent = ({ item}) => {

    const data = item

    switch (data) {

        case "item":

            return <OffreursCarousel offreurs={offreurs} />

        case "offreurs":
            return Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="px-3 lg:px-0 md:px-0">
                    <div className="flex gap-5">
                        <h3>{category}</h3>
                        {items?.length >1 && <h2 className="bg-gray-100 rounded-full h-8 w-8 items-center justify-center text-center">{items.length}</h2>}
                    </div>
                    <OffreursCarousel offreurs={items} />
                </div>
            ))

        case "demande":

            return <DemandePubliqueForm />

        case "abonnements":

            return <SubscriptionsPage/>

        default:
            console.log("Cool")


    }

}

const grouped = offreurs.reduce((acc, item) => {
    const cat = item.category || "autres"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
}, {})

function Popover({ trigger, children, placement = "bottom" }) {

    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    // click outside to close
    useEffect(() => {

        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false)
            }
        }
        document.addEventListener("click", handler)
        return () => document.removeEventListener("click", handler)
    }, [])

    return (
        <div className="relative inline-block" ref={ref}>
            <div onClick={() => setOpen(!open)} className="cursor-pointer">
                {trigger}
            </div>

            {open && (
                <div
                    className={`
                        fixed inset-0 z-[99] flex justify-center items-center
                        bg-white/80 rounded-lg p-3
                        overflow-hidden
                    `}
                >
                    <button className="absolute top-18 right-7 cursor-pointer" onClick={() => setOpen(!open)}>X</button>
                    {children}
                </div>
            )}
        </div>
    )
}

const ChatHelloAbalma = () => {

    const messagesEndRef = useRef(null);

    return (

        <div className="flex flex-col h-[88dvh] ">


            <div className="flex-1 overflow-y-auto px-3 py-7 h-50 rounded-lg bg-gray-50">
                <React.Fragment key={``} >

                {/*{*/}
                {/*    showDateLabel && (*/}

                {/*        <li className="text-center text-xs text-gray-500 py-2">*/}
                {/*            {currentDateLabel}*/}
                {/*        </li>*/}
                {/*    )*/}
                {/*}*/}

                <li className={`flex items-end gap-2 pb-3 `}>

                    {
                        !true && (

                            <img
                                src={""}
                                alt="avatar"
                                className="h-5 w-5 rounded-full object-cover shadow-lg"
                            />
                        )
                    }

                    <div className="d-flex flex-col w-auto">

                        <div className={`w-full px-2 py-2 text-sm rounded-2xl flex flex-col shadow-md`}>
                            {/*<p>{msg?.text}</p>*/}
                        </div>

                        <p className="text-[9px] text-grey-500 mt-1">
                            {/*{(msg?.date?.split(" ")[1]) || maintenant.toLocaleTimeString()}*/}
                        </p>

                    </div>

                    {
                        true && (
                            <img
                                src={""}
                                alt="avatar"
                                className="h-5 w-5 rounded-full object-cover"
                            />
                        )
                    }

                </li>

                <div ref={messagesEndRef} />

            </React.Fragment>
            </div>

            {/* input zone */}
            <div className="sticky bottom-6 left-0 px-2">

                <div className="flex items-center gap-0">

                    <input
                        value=""
                        onChange={e =>alert("Amanisty")}
                        onKeyDown={e => e.key === "Enter"}
                        placeholder="Votre message..."
                        className="bg-none flex-1 px-3 py-2 border-r-0 border border-gray-300 rounded-e-none rounded-xl text-sm focus:outline-none focus:ring-0 "
                    />

                    <button
                        onClick={() => alert("Button cliecked")}
                        className="rounded-e-full border-l-0 border border-gray-300 px-5 py-2 text-base  text-white transition bg-none from-purple-300 to-blue-300 hover:bg-gradient-to-br hover:from-purple-50 "
                        aria-label="Envoyer"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 2a1 1 0 0 1 .932.638l7 18a1 1 0 0 1-1.326 1.281L13 19.517V13a1 1 0 1 0-2 0v6.517l-5.606 2.402a1 1 0 0 1-1.326-1.281l7-18A1 1 0 0 1 12 2Z"
                            />
                        </svg>

                    </button>

                </div>

            </div>

        </div>
    )
}

