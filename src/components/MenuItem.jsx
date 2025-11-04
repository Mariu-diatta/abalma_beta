import tshirt from "../../src/assets/marketing_12034081.png" 
import packProduct from "../../src/assets/products_1312205.png" 
import toy_car from "../../src/assets/toy-car_2179775.png"
import book from "../../src/assets/books_6578221.png"  
import road from "../../src/assets/road_16063355.png" 
import bureau from "../../src/assets/bureau_18081488.png"  
import gaming_ from "../../src/assets/gaming_6749691.png"  
import bags from "../../src/assets/shopping-bags_8079986.png" 
import music from "../../src/assets/music.png" 
import circuit_board from "../../src/assets/circuit-board.png" 
import sport from "../../src/assets/physical.png"
import home_appliance from "../../src/assets/home-appliance.png"
import jewelry from "../../src/assets/jewelry.png"
import cosmetics from "../../src/assets/cosmetics.png"
import health_beauty from "../../src/assets/suncream.png"
import home_deco from "../../src/assets/lamp.png"
import baby from "../../src/assets/pram.png"
import gardening from "../../src/assets/gardening.png"
import tools from "../../src/assets/tool-box.png"
import pets from "../../src/assets/veterinary.png"
import services from "../../src/assets/service.png"
import shoes from "../../src/assets/footwear.png"
import movies from "../../src/assets/clapperboard.png"
import phone from "../../src/assets/hobby.png"
import art from "../../src/assets/art.png"
import travel from "../../src/assets/abroad.png"
import hightech from "../../src/assets/laser-cutting.png"
import automoto from "../../src/assets/race-bike.png"
import medical from "../../src/assets/medical.png"




export const menuItems = (t) => [

    {
        name: t('Produits'),
        to: '/produits/',
        id: "all-products",
        svg: <img className="rounded-sm" src={packProduct} alt="" width="25" />,
    },

    // --- Catégories principales ---
    {
        name: t('Musique'),
        to: '/products/filter/?categorie_product=MUSIQUE',
        id: 'musique',
        svg: <img className="rounded-sm" src={music} alt="" width="25" />,
    },
    {
        name: t('Habits'),
        to: '/products/filter/?categorie_product=HABITS',
        id: 'habits',
        svg: <img className="rounded-sm" src={tshirt} alt="" width="25" />,
    },
    {
        name: t('Livres'),
        to: '/products/filter/?categorie_product=LIVRES',
        id: 'livres',
        svg: <img className="rounded-sm" src={book} alt="" width="25" />,
    },
    {
        name: t('Jouets'),
        to: '/products/filter/?categorie_product=JOUETS',
        id: 'jouets',
        svg: <img className="rounded-sm" src={toy_car} alt="" width="25" />,
    },
    {
        name: t('Vehicules'),
        to: '/products/filter/?categorie_product=VEHICULES',
        id: 'vehicules',
        svg: <img className="rounded-sm" src={road} alt="" width="25" />,
    },
    {
        name: t('Meubles'),
        to: '/products/filter/?categorie_product=MEUBLES',
        id: 'meubles',
        svg: <img className="rounded-sm" src={bureau} alt="" width="25" />,
    },
    {
        name: t('Jeux_video'),
        to: '/products/filter/?categorie_product=JEUX_VIDEO',
        id: 'jeux-video',
        svg: <img className="rounded-sm" src={gaming_} alt="" width="25" />,
    },
    {
        name: t('Sacs'),
        to: '/products/filter/?categorie_product=SACS',
        id: 'sacs',
        svg: <img className="rounded-sm" src={bags} alt="" width="25" />,
    },

    // --- Nouvelles catégories ---
    {
        name: t('Electronique'),
        to: '/products/filter/?categorie_product=ELECTRONIQUE',
        id: 'electronique',
        svg: <img className="rounded-sm" src={circuit_board} alt="" width="25" />,
    },
    {
        name: t('Sport'),
        to: '/products/filter/?categorie_product=SPORT',
        id: 'sport',
        svg:  <img className="rounded-sm" src={sport} alt="" width="25" />,
    },
    {
        name: t('Electroménager'),
        to: '/products/filter/?categorie_product=ELECTROMENAGER',
        id: 'electromenager',
        svg: <img className="rounded-sm" src={home_appliance} alt="" width="25" />,
    },
    {
        name: t('Bijoux'),
        to: '/products/filter/?categorie_product=BIJOUX',
        id: 'bijoux',
        svg: <img className="rounded-sm" src={jewelry} alt="" width="25" />,
    },
    {
        name: t('Cosmetiques'),
        to: '/products/filter/?categorie_product=COSMETIQUES',
        id: 'cosmetiques',
        svg: <img className="rounded-sm" src={cosmetics} alt="" width="25" />,
    },
    {
        name: t('Sante_beaute'),
        to: '/products/filter/?categorie_product=SANTE_BEAUTE',
        id: 'sante-beaute',
        svg: <img className="rounded-sm" src={health_beauty} alt="" width="25" />,
    },
    {
        name: t('Maison_decoration'),
        to: '/products/filter/?categorie_product=MAISON_DECORATION',
        id: 'maison-decoration',
        svg:<img className="rounded-sm" src={home_deco} alt="" width="25" />
    },
    {
        name: t('Bebes_puericulture'),
        to: '/products/filter/?categorie_product=BEBES',
        id: 'bebes',
        svg: <img className="rounded-sm" src={baby} alt="" width="25" />,
    },
    {
        name: t('Jardinage'),
        to: '/products/filter/?categorie_product=JARDINAGE',
        id: 'jardinage',
        svg:  <img className="rounded-sm" src={gardening} alt="" width="25" />,
    },
    {
        name: t('Bricolage'),
        to: '/products/filter/?categorie_product=BRICOLAGE',
        id: 'bricolage',
        svg: <img className="rounded-sm" src={tools} alt="" width="25" />,
    },
    {
        name: t('Animaux'),
        to: '/products/filter/?categorie_product=ANIMAUX',
        id: 'animaux',
        svg: <img className="rounded-sm" src={pets} alt="" width="25" />,
    },
    {
        name: t('Telephone'),
        to: '/products/filter/?categorie_product=TELEPHONY',
        id: 'telephonie',
        svg:<img className="rounded-sm" src={phone} alt="" width="25" />,
    },
    {
        name: t('Chaussures'),
        to: '/products/filter/?categorie_product=CHAUSSURES',
        id: 'chaussures',
        svg: <img className="rounded-sm" src={shoes} alt="" width="25" />,
    },
    {
        name: t('Films_series'),
        to: '/products/filter/?categorie_product=FILMS_SERIES',
        id: 'films-series',
        svg: <img className="rounded-sm" src={movies} alt="" width="25" />,
    },
    {
        name: t('Services'),
        to: '/products/filter/?categorie_product=SERVICES',
        id: 'services',
        svg: <img className="rounded-sm" src={services} alt="" width="25" />,
    },
    {
        name: t('Art_artisanat'),
        to: '/products/filter/?categorie_product=ART',
        id: 'art',
        svg: <img className="rounded-sm" src={art} alt="" width="25" />,
    },
    {
        name: t('Voyage_loisirs'),
        to: '/products/filter/?categorie_product=VOYAGE',
        id: 'voyage',
        svg:<img className="rounded-sm" src={travel} alt="" width="25" />,
    },
    {
        name: t('High_Tech'),
        to: '/products/filter/?categorie_product=HIGH_TECH',
        id: 'high-tech',
        svg: <img className="rounded-sm" src={hightech} alt="" width="25" />,
    },
    {
        name: t('Auto_Moto'),
        to: '/products/filter/?categorie_product=AUTOMOTO',
        id: 'automoto',
        svg: <img className="rounded-sm" src={automoto} alt="" width="25" />,
    },
    {
        name: t('Materiel_medical'),
        to: '/products/filter/?categorie_product=MEDICAL',
        id: 'medical',
        svg:  <img className="rounded-sm" src={medical} alt="" width="25" />,
    },
];



