import { STYLE, categoriesConfig } from "../utils";

// imports images
const images = {
    clothers: require("../../src/assets/marketing_12034081.png"),
    toy_car: require("../../src/assets/toy-car_2179775.png"),
    car: require("../../src/assets/road_16063355.png"),
    meubles: require("../../src/assets/bureau_18081488.png"),
    gaming: require("../../src/assets/gaming_6749691.png"),
    bags: require("../../src/assets/shopping-bags_8079986.png"),
    music: require("../../src/assets/music.png"),
    electronique: require("../../src/assets/circuit-board.png"),
    sport: require("../../src/assets/physical.png"),
    home_appliance: require("../../src/assets/home-appliance.png"),
    jewelry: require("../../src/assets/jewelry.png"),
    cosmetics: require("../../src/assets/cosmetics.png"),
    health_beauty: require("../../src/assets/suncream.png"),
    home_deco: require("../../src/assets/lamp.png"),
    baby: require("../../src/assets/pram.png"),
    gardening: require("../../src/assets/gardening.png"),
    tools: require("../../src/assets/tool-box.png"),
    pets: require("../../src/assets/veterinary.png"),
    services: require("../../src/assets/service.png"),
    shoes: require("../../src/assets/footwear.png"),
    movies: require("../../src/assets/clapperboard.png"),
    art: require("../../src/assets/art.png"),
    travel: require("../../src/assets/abroad.png"),
    hightech: require("../../src/assets/laser-cutting.png"),
    automoto: require("../../src/assets/race-bike.png"),
    medical: require("../../src/assets/medical.png"),
    phone: require("../../src/assets/phone.png"),
    notbooks: require("../../src/assets/cahier.png"),
    books: require("../../src/assets/livre.png"),
    fourniture: require("../../src/assets/fourniture.png"),
    materiel_info: require("../../src/assets/materiel_info.png"),
    divers: require("../../src/assets/produits.png"),
    alimentation: require("../../src/assets/nouriture.png"),
    all_products: require("../../src/assets/icons8-hug-94.png")
};

export const menuItems = (t) =>
    categoriesConfig.map(cat => ({
        key: cat.key,
        name: t(`ListItemsFilterProduct.${cat.name}`),
        to: cat.to,
        id: cat.id,
        photo: <img
                loading="lazy"
                className={STYLE.STYLE_BTN_CATEGORIES}
                src={images[cat.idx]}
                alt=""
                width="120"
                height="100"
            />
       
    }));