import tshirt from "../../src/assets/marketing_12034081.png" 
import toy_car from "../../src/assets/toy-car_2179775.png" 
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
//import phone from "../../src/assets/hobby.png"
import art from "../../src/assets/art.png"
import travel from "../../src/assets/abroad.png"
import hightech from "../../src/assets/laser-cutting.png"
import automoto from "../../src/assets/race-bike.png"
import medical from "../../src/assets/medical.png"
import phone from "../../src/assets/phone.png"
import cahier from "../../src/assets/cahier.png"
import livre from "../../src/assets/livre.png"
import fourniture from "../../src/assets/fourniture.png"
import materiel_info from "../../src/assets/materiel_info.png"
import all_product from "../../src/assets/produits.png"
import nouriture from "../../src/assets/nouriture.png"


export const menuItems = (t) => [

    {
        name: t('All'),
        to: '/produits/',
        id: "all-products",
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={all_product} alt="" width="30" height="30" />,
    },

    // --- Catégories principales ---
    {
        name: t('Musique'),
        to: '/products/filter/?categorie_product=MUSIQUE',
        id: 'musique',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={music} alt="" width="30" height="30" />,
    },
    {
        name: t('Habits'),
        to: '/products/filter/?categorie_product=HABITS',
        id: 'habits',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={tshirt} alt="" width="30" height="30" />,
    },
    {
        name: t('Livres'),
        to: '/products/filter/?categorie_product=LIVRES',
        id: 'livres',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={livre} alt="" width="30" height="30" />,
    },
    {
        name: t('Jouets'),
        to: '/products/filter/?categorie_product=JOUETS',
        id: 'jouets',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lgbg-none" src={toy_car} alt="" width="30" height="30" />,
    },
    {
        name: t('Vehicules'),
        to: '/products/filter/?categorie_product=VEHICULES',
        id: 'vehicules',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={road} alt="" width="30" height="30" />,
    },
    {
        name: t('Meubles'),
        to: '/products/filter/?categorie_product=MEUBLES',
        id: 'meubles',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={bureau} alt="" width="30" height="30" />,
    },
    {
        name: t('ListItemsFilterProduct.JEUX_VIDEO'),
        to: '/products/filter/?categorie_product=JEUX_VIDEO',
        id: 'jeux-video',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={gaming_} alt="" width="30" height="30" />,
    },
    {
        name: t('Sacs'),
        to: '/products/filter/?categorie_product=SACS',
        id: 'sacs',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={bags} alt="" width="30" height="30" />,
    },

    // --- Nouvelles catégories ---
    {
        name: t('ListItemsFilterProduct.ELECTRONIQUE'),
        to: '/products/filter/?categorie_product=ELECTRONIQUE',
        id: 'electronique',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={circuit_board} alt="" width="30" height="30" />,
    },
    {
        name: t('Sport'),
        to: '/products/filter/?categorie_product=SPORT',
        id: 'sport',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={sport} alt="" width="30" height="30" />,
    },
    {
        name: t('ListItemsFilterProduct.ELECTROMENAGER'),
        to: '/products/filter/?categorie_product=ELECTROMENAGER',
        id: 'electromenager',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={home_appliance} alt="" width="30" height="30" />,
    },
    {
        name: t('Bijoux'),
        to: '/products/filter/?categorie_product=BIJOUX',
        id: 'bijoux',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={jewelry} alt="" width="30" height="30" />,
    },
    {
        name: t('Cosmetiques'),
        to: '/products/filter/?categorie_product=COSMETIQUES',
        id: 'cosmetiques',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={cosmetics} alt="" width="30" height="30" />,
    },
    {
        name: t('Sante_beaute'),
        to: '/products/filter/?categorie_product=SANTE_BEAUTE',
        id: 'sante-beaute',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={health_beauty} alt="" width="30" height="30" />,
    },
    {
        name: t('Maison_decoration'),
        to: '/products/filter/?categorie_product=MAISON_DECORATION',
        id: 'maison-decoration',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={home_deco} alt="" width="30" height="30" />
    },
    {
        name: t('Bebes_puericulture'),
        to: '/products/filter/?categorie_product=BEBES',
        id: 'bebes',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={baby} alt="" width="30" height="30" />,
    },
    {
        name: t('Jardinage'),
        to: '/products/filter/?categorie_product=JARDINAGE',
        id: 'jardinage',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={gardening} alt="" width="30" height="30" />,
    },
    {
        name: t('Bricolage'),
        to: '/products/filter/?categorie_product=BRICOLAGE',
        id: 'bricolage',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={tools} alt="" width="30" height="30" />,
    },
    {
        name: t('Animaux'),
        to: '/products/filter/?categorie_product=ANIMAUX',
        id: 'animaux',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={pets} alt="" width="30" height="30" />,
    },
    {
        name: t('ListItemsFilterProduct.TELEPHONIE'),
        to: '/products/filter/?categorie_product=TELEPHONY',
        id: 'telephonie',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={phone} alt="" width="30" height="30" />,
    },
    {
        name: t('Chaussures'),
        to: '/products/filter/?categorie_product=CHAUSSURES',
        id: 'chaussures',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={shoes} alt="" width="30" height="30" />,
    },
    {
        name: t('Films_series'),
        to: '/products/filter/?categorie_product=FILMS_SERIES',
        id: 'films-series',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={movies} alt="" width="30" height="30" />,
    },
    {
        name: t('Services'),
        to: '/products/filter/?categorie_product=SERVICES',
        id: 'services',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={services} alt="" width="30" height="30" />,
    },
    {
        name: t('Art_artisanat'),
        to: '/products/filter/?categorie_product=ART',
        id: 'art',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={art} alt="" width="30" height="30" />,
    },
    {
        name: t('Voyage_loisirs'),
        to: '/products/filter/?categorie_product=VOYAGE',
        id: 'voyage',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={travel} alt="" width="30" height="30" />,
    },
    {
        name: t('High_Tech'),
        to: '/products/filter/?categorie_product=HIGH_TECH',
        id: 'high-tech',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={hightech} alt="" width="30" height="30" />,
    },
    {
        name: t('Auto_Moto'),
        to: '/products/filter/?categorie_product=AUTOMOTO',
        id: 'automoto',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={automoto} alt="" width="30" height="30" />,
    },
    {
        name: t('Materiel_medical'),
        to: '/products/filter/?categorie_product=MEDICAL',
        id: 'medical',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={medical} alt="" width="30" height="30" />,
    },
    {
        name: t('jewelry'),
        to: '/products/filter/?categorie_product=JEWELRY',
        id: 'jewelry',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={jewelry} alt="" width="30" height="30" />,
    },
    {
        name: t('ListItemsFilterProduct.MATERIELS_INFORMATIQUES'),
        to: '/products/filter/?categorie_product=MATERIELS_INFORMATIQUES',
        id: 'materiels-informatiques',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={materiel_info} alt="" width="30" height="30" />,
    },
    {
        name: t('ListItemsFilterProduct.CAHIERS'),
        to: '/products/filter/?categorie_product=CAHIERS',
        id: 'cahiers',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={cahier} alt="" width="30" height="30" />,
    },
    {
        name: t('ListItemsFilterProduct.ACCESSOIRES'),
        to: '/products/filter/?categorie_product=ACCESSOIRES',
        id: 'accessoires',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={shoes} alt="" width="30" height="30" />,
    },
    {
        name: t('ListItemsFilterProduct.FOURNITURES_SCOLAIRES'),
        to: '/products/filter/?categorie_product=FOURNITURES_SCOLAIRES',
        id: 'fournitures-scolaires',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={fourniture} alt="" width="30" height="30" />,
    },
    {
        name: t('ListItemsFilterProduct.ALIMENTATION'),
        to: '/products/filter/?categorie_product=ALIMENTATION',
        id: 'alimentation',
        svg: <img className="rounded-lg bg-gray-50 grayscale shadow-lg bg-none" src={nouriture} alt="" width="30" height="30" />,
    },
];



