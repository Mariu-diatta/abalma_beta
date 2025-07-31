
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

     "jouets", "sacs", "materiels", "electronique", "habits",

    "livres", "Jeux_video", "Meubles", "Vehicules",

    "Fournitures_scolaires", "divers",
]