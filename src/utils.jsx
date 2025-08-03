
//covertion de la date de la transaction
export const convertDate = (dat) => {

    const date = new Date(dat);

    const formatted = date.toLocaleString("fr-FR", {

        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    return formatted
}

export const  LIST_CATEGORY=[

    { idx: "jouets", filter: "JOUET" }, { idx: "sacs", filter: "SACS" }, { idx: "materiels", filter: "MAETERIELS" }, { idx: "electronique", filter: "ELECTRONIQUES" }, { idx: "habits" , filter:"HABITS"},

    { idx: "livres", filter: "LIVRES" }, { idx: "Jeux_video", filter: "JEUX_VIDEO" }, { idx: "Meubles", filter: "MEUBLES" }, { idx: "Vehicules" , filter:"VEHICULES"},

    { idx: "Fournitures_scolaires", filter: "FOURNISSEURS_SCOLAIRES" }, { idx: "divers", filter: "DIVERS" }, { idx: "telephones", filter: "TELEPHONIE" }
]

export const numberStarsViews = (numberStars_) => {

    const numberStars = parseInt(numberStars_, 10);

    if (numberStars >= 40) return 4;

    if (numberStars >= 30) return 4;

    if (numberStars >= 10) return 3;

    if (numberStars >= 5) return 2;

    if (numberStars === 1) return 1;

    return 0;
};