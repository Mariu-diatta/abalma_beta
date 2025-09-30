import api from "../services/Axios";
import tshirt from "../../src/assets/marketing_12034081.png" 
import packProduct from "../../src/assets/products_1312205.png" 
import toy_car from "../../src/assets/toy-car_2179775.png"
import book from "../../src/assets/books_6578221.png"  
import road from "../../src/assets/road_16063355.png" 
import bureau from "../../src/assets/bureau_18081488.png"  
import gaming_ from "../../src/assets/gaming_6749691.png"  
import bags from "../../src/assets/shopping-bags_8079986.png" 

export const menuItems =(t)=>[
    {
        name: t('Produits'),
        to: '/produits/',
        id: "all-products",
        svg: (
            <img className="rounded-sm " src={packProduct} alt="" width="25" />
        ),
    },
    {
        name: t('habits'),
        to: '/products/filter/?categorie_product=HABITS',
        id: 'habits',
        svg: (
            <img className="rounded-sm border-0" src={tshirt} alt="" width="25" />
        ),
    },
    {
        name: t('Livres'),
        to: '/products/filter/?categorie_product=LIVRES',
        id: 'livres',
        svg: (
            <img className="rounded-sm " src={book} alt="" width="25" /> 

        ),
    },
    //{
    //    name: 'Materiels',
    //    to: '/products/filter/?categorie_product=MATERIELS_INFORMATIQUES',
    //    id: 'materiels',
    //    svg: (
    //        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 23">
    //            <path d="M8.4 6.763c-.251.1-.383.196-.422.235L6.564 5.584l2.737-2.737c1.113-1.113 3.053-1.097 4.337.187l1.159 1.159a1 1 0 0 1 1.39.022l4.105 4.105a1 1 0 0 1 .023 1.39l1.345 1.346a1 1 0 0 1 0 1.415l-2.052 2.052a1 1 0 0 1-1.414 0l-1.346-1.346a1 1 0 0 1-1.323.039L11.29 8.983a1 1 0 0 1 .04-1.324l-.849-.848c-.18-.18-.606-.322-1.258-.25a3.271 3.271 0 0 0-.824.202Zm1.519 3.675L3.828 16.53a1 1 0 0 0 0 1.414l2.736 2.737a1 1 0 0 0 1.414 0l6.091-6.091-4.15-4.15Z" />
    //        </svg>
    //    ),
    //},
    {
        name: t('Jouets'),
        to: '/products/filter/?categorie_product=JOUETS',
        id: 'jouets',
        svg: (
            <img className="rounded-sm " src={toy_car} alt="" width="25" /> 
        ),
    },
    //{
    //    name: 'Electronique',
    //    to: '/products/filter/?categorie_product=ELECTROMENAGER',
    //    id: 'electronique',
    //    svg: (
    //        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">
    //            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z" />
    //        </svg>
    //    ),
    //},
    {
        name: t('Vehicules'),
        to: '/products/filter/?categorie_product=VEHICULES', 
        id: 'vehicules',
        svg: (
            <img className="rounded-sm " src={road} alt="" width="25" /> 
        ),
    },
    {
        name: t('Meubles'),
        to: '/products/filter/?categorie_product=MEUBLES',
        id: 'meubles',
        svg: (
            <img className="rounded-sm " src={bureau} alt="" width="25" />
        ),
    },
    {
        name: t('Jeux_videos'),
        to: '/products/filter/?categorie_product=JEUX_VIDEO',
        id: 'jeux-video',
        svg: (
            <img className="rounded-sm " src={gaming_} alt="" width="25"  /> 
        ),
    },
    {
        name: t('Sacs'),
        to: '/products/filter/?categorie_product=SACS',
        id: 'sacs',
        svg: (
            <img className="rounded-sm " src={bags} alt = "" width = "25"/>
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



