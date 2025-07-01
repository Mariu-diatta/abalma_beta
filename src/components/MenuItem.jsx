import api from "../services/Axios";

export const menuItems = [
    {
        name: 'Produits',
        to: '/produits/',
        id: "all_products",
        svg: (
            <svg className="shrink-0 w-6 h-7 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
            </svg>
        ),
    },
    {
        name: 'habits',
        to: '/products/filter/?categorie_product=HABITS',
        id: 'habits',
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path fillRule="evenodd" d="M5.833 5a5 5 0 0 1 3-1h6.334a5 5 0 0 1 3 1L21.1 7.2a1 1 0 0 1 .268 1.296l-2 3.5a1 1 0 0 1-1.382.361l-.986-.59V19a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-7.234l-.985.591a1 1 0 0 1-1.383-.36l-2-3.5A1 1 0 0 1 2.9 7.2L5.833 5ZM14 5h-4c0 .425.223.933.645 1.355.422.423.93.645 1.355.645.425 0 .933-.222 1.355-.645.423-.422.645-.93.645-1.355Z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        name: 'Livres',
        to: '/products/filter/?categorie_product=LIVRES',
        id: 'livres',
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
            </svg>
        ),
    },
    {
        name: 'Materiels',
        to: '/products/filter/?categorie_product=MATERIELS_INFORMATIQUES',
        id: 'materiels',
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 23">
                <path d="M8.4 6.763c-.251.1-.383.196-.422.235L6.564 5.584l2.737-2.737c1.113-1.113 3.053-1.097 4.337.187l1.159 1.159a1 1 0 0 1 1.39.022l4.105 4.105a1 1 0 0 1 .023 1.39l1.345 1.346a1 1 0 0 1 0 1.415l-2.052 2.052a1 1 0 0 1-1.414 0l-1.346-1.346a1 1 0 0 1-1.323.039L11.29 8.983a1 1 0 0 1 .04-1.324l-.849-.848c-.18-.18-.606-.322-1.258-.25a3.271 3.271 0 0 0-.824.202Zm1.519 3.675L3.828 16.53a1 1 0 0 0 0 1.414l2.736 2.737a1 1 0 0 0 1.414 0l6.091-6.091-4.15-4.15Z" />
            </svg>
        ),
    },
    {
        name: 'Jouets',
        to: '/products/filter/?categorie_product=JOUET',
        id: 'jouets',
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 23">
                <path fillRule="evenodd" d="M12 2a10 10 0 1 0 10 10A10.009 10.009 0 0 0 12 2Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.093 20.093 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM10 3.707a8.82 8.82 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.755 45.755 0 0 0 10 3.707Zm-6.358 6.555a8.57 8.57 0 0 1 4.73-5.981 53.99 53.99 0 0 1 3.168 4.941 32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.641 31.641 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM12 20.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 15.113 13a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clipRule="evenodd" />
            </svg>
        ),
    },
    {
        name: 'Electronique',
        to: '/products/filter/?categorie_product=ELECTROMENAGER',
        id: 'electronique',
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z" />
            </svg>
        ),
    },
    {
        name: 'Véhicules',
        to: '/products/filter/?categorie_product=VEHICULES',
        id: 'Véhicules',
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z" />
            </svg>
        ),
    },
    {
        name: 'Meubles',
        to: '/products/filter/?categorie_product=MEUBLES',
        id: 'Meubles',
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z" />
            </svg>
        ),
    },
    {
        name: 'Jeux vidéo',
        to: '/products/filter/?categorie_product=JEUX_VIDEO',
        id: 'Jeux_vidéo',
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z" />
            </svg>
        ),
    },
    {
        name: 'Sacs',
        to: '/products/filter/?categorie_product=SACS',
        id: 'sacs',
        svg: (
            <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
                <path fill="currentColor" fillRule="evenodd" d="M12.2605 3.79368c-.281-.22353-.5975-.3898-.9173-.5062-.7024-.25567-1.49918-.30568-2.24095-.18661-1.15818.18592-2.51613.88193-2.97474 2.22764-.40442.04107-.77944.1442-1.12195.31017-.59942.29046-1.02697.73841-1.32274 1.22999C3.11436 7.81349 3 8.97014 3 9.78568c0 .89142.27124 1.65012.76053 2.21432H20.3218c.0101-.0125.0201-.0251.0301-.0379.4919-.6324.6411-1.4185.6479-2.12509.1233-1.32715-.3036-2.47-1.0971-3.27874-.6018-.6132-1.3829-1.00304-2.2193-1.15392-.431-1.19435-1.444-2.10209-2.8973-2.26254-.9135-.10087-1.819.19102-2.5256.65187ZM9 8c0-.55228.44772-1 1-1h.01c.5523 0 1 .44772 1 1s-.4477 1-1 1H10c-.55228 0-1-.44772-1-1Zm4 0c0-.55228.4477-1 1-1h.01c.5523 0 1 .44772 1 1s-.4477 1-1 1H14c-.5523 0-1-.44772-1-1Zm-7 2c0-.55228.44772-1 1-1h.01c.55228 0 1 .44772 1 1 0 .5523-.44772 1-1 1H7c-.55228 0-1-.4477-1-1Zm5 0c0-.55228.4477-1 1-1h.01c.5523 0 1 .44772 1 1 0 .5523-.4477 1-1 1H12c-.5523 0-1-.4477-1-1Zm5 0c0-.55228.4477-1 1-1h.01c.5523 0 1 .44772 1 1 0 .5523-.4477 1-1 1H17c-.5523 0-1-.4477-1-1Z" clipRule="evenodd" />
                <path fill="currentColor" d="M20.6134 14.6222c.1145-.3088-.1249-.6222-.4542-.6222H3.84086c-.32935 0-.56875.3134-.45429.6222.76918 2.0753 2.462 3.7423 4.59004 4.6741V20c0 .5523.44772 1 1 1h6.04679c.5523 0 1-.4477 1-1v-.7037c2.128-.9318 3.8209-2.5988 4.59-4.6741Z" />
            </svg>
        ),
    }
];


export const lesAccount = async () => {

    try {

        const response = await api.get('/clients/')

        console.log(response.data)

    } catch (error) {

        console.error('Erreur lors de la récupération des clients', error)
    }
}



