import React, { useState, useMemo } from "react";

const ProductTablePagination = () => {
    const data = [
        { id: 1, name: 'Apple MacBook Pro 17"', color: "Silver", category: "Laptop", price: 2999, statut: "en cours" },
        { id: 2, name: "Microsoft Surface Pro", color: "White", category: "Laptop PC", price: 1999, statut: "vendu" },
        { id: 3, name: "Magic Mouse 2", color: "Black", category: "Accessories", price: 99, statut: "offert" },
        { id: 4, name: "Apple Watch", color: "Black", category: "Watches", price: 199, statut: "offert" },
        { id: 5, name: "Apple iMac", color: "Silver", category: "PC", price: 2999, statut: "prete" },
        { id: 6, name: "Apple AirPods", color: "White", category: "Accessories", price: 399, statut: "prete" },
        { id: 7, name: "iPad Pro", color: "Gold", category: "Tablet", price: 699, statut: "offert" },
        { id: 8, name: "Magic Keyboard", color: "Black", category: "Accessories", price: 99, statut: "offert" },
        { id: 9, name: "Smart Folio iPad Air", color: "Blue", category: "Accessories", price: 79, statut: "offert" },
        { id: 10, name: "AirTag", color: "Silver", category: "Accessories", price: 29, statut: "en cours" },
    ];

    const ITEMS_PER_PAGE = 5;

    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatut, setFilterStatut] = useState("Tous");
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    // Filtrage par statut réel
    const statutsOptions = ["Tous", "en cours", "vendu", "offert", "prete"];

    // Filtrage et recherche
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const search = searchTerm.toLowerCase();
            const matchesSearch =
                item.name.toLowerCase().includes(search) ||
                item.color.toLowerCase().includes(search) ||
                item.category.toLowerCase().includes(search) ||
                item.statut.toLowerCase().includes(search);

            const matchesStatut = filterStatut === "Tous" || item.statut === filterStatut;

            return matchesSearch && matchesStatut;
        });
    }, [data, searchTerm, filterStatut]);

    // Tri
    const sortedData = useMemo(() => {
        if (!sortConfig.key) return filteredData;

        const sorted = [...filteredData].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (typeof aValue === "string") aValue = aValue.toLowerCase();
            if (typeof bValue === "string") bValue = bValue.toLowerCase();

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });

        return sorted;
    }, [filteredData, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);

    // Pagination
    const currentItems = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedData.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedData, currentPage]);

    // Gestion tri
    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Gestion sélection
    const toggleSelectAll = () => {
        if (selectedIds.size === currentItems.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(currentItems.map(i => i.id)));
        }
    };

    const toggleSelectOne = (id) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // Reset page si filtre/search change
    React.useEffect(() => {
        setCurrentPage(1);
        setSelectedIds(new Set());
    }, [searchTerm, filterStatut]);

    return (
        <div className="mt-5 relative overflow-x-auto shadow-md sm:rounded-lg p-4 bg-white dark:bg-gray-800">
            <h2 className="m-2 text-xl font-bold dark:text-white">Mes commandes recentes</h2>

            <div className="m-2 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                {/* Filtre statut */}
                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="inline-flex items-center text-gray-700 bg-gray-100 border border-gray-300 rounded-lg px-3 py-1.5 dark:bg-gray-700 dark:text-white"
                        aria-haspopup="listbox"
                        aria-expanded={dropdownOpen}
                    >
                        <span className="capitalize">{filterStatut}</span>
                        <svg
                            className="w-3 h-3 ms-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </button>
                    {dropdownOpen && (
                        <ul
                            className="absolute z-10 mt-1 w-40 bg-white rounded shadow-lg dark:bg-gray-700"
                            role="listbox"
                            aria-label="Filtrer par statut"
                        >
                            {statutsOptions.map((statut) => (
                                <li
                                    key={statut}
                                    className={`cursor-pointer px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded ${filterStatut === statut ? "bg-blue-500 text-white" : ""
                                        } capitalize`}
                                    onClick={() => {
                                        setFilterStatut(statut);
                                        setDropdownOpen(false);
                                    }}
                                    tabIndex={0}
                                    onKeyDown={e => e.key === "Enter" && (setFilterStatut(statut), setDropdownOpen(false))}
                                >
                                    {statut}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Recherche */}
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full sm:w-80 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        aria-label="Recherche dans la table"
                    />
                </div>
            </div>

            {/* Tableau */}
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300">
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th className="p-3">
                            <input
                                type="checkbox"
                                onChange={toggleSelectAll}
                                checked={selectedIds.size === currentItems.length && currentItems.length > 0}
                                aria-label="Sélectionner tout"
                            />
                        </th>
                        {["name", "color", "category", "price", "statut"].map((key) => (
                            <th
                                key={key}
                                className="px-4 py-3 cursor-pointer select-none"
                                onClick={() => requestSort(key)}
                                aria-sort={
                                    sortConfig.key === key
                                        ? sortConfig.direction === "asc"
                                            ? "ascending"
                                            : "descending"
                                        : "none"
                                }
                                tabIndex={0}
                                onKeyDown={e => e.key === "Enter" && requestSort(key)}
                            >
                                <div className="flex items-center space-x-1 capitalize">
                                    <span>
                                        {key === "name"
                                            ? "Nom"
                                            : key === "color"
                                                ? "Couleur"
                                                : key === "category"
                                                    ? "Catégorie"
                                                    : key === "price"
                                                        ? "Prix"
                                                        : "Statut"}
                                    </span>
                                    {sortConfig.key === key ? (
                                        sortConfig.direction === "asc" ? (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 15l5-5 5 5H5z" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M5 7l5 5 5-5H5z" /></svg>
                                        )
                                    ) : null}
                                </div>
                            </th>
                        ))}
                        <th className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="text-center py-4 dark:text-white">
                                Aucun resultat trouve.
                            </td>
                        </tr>
                    ) : (
                        currentItems.map((item) => (
                            <tr
                                key={item.id}
                                className={`border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 ${selectedIds.has(item.id) ? "bg-blue-100 dark:bg-blue-800" : ""
                                    }`}
                            >
                                <td className="p-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.has(item.id)}
                                        onChange={() => toggleSelectOne(item.id)}
                                        aria-label={`Sélectionner ${item.name}`}
                                    />
                                </td>
                                <td className="px-4 py-3 font-medium">{item.name}</td>
                                <td className="px-4 py-3">{item.color}</td>
                                <td className="px-4 py-3">{item.category}</td>
                                <td className="px-4 py-3">{item.price.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</td>
                                <td className="px-4 py-3 capitalize">{item.statut}</td>
                                <td className="px-6 py-3">
                                    <button
                                        className="text-blue-600 hover:underline dark:text-blue-400"
                                        onClick={() => alert(`Modifier: ${item.name}`)}
                                        aria-label={`Modifier ${item.name}`}
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            <nav
                className="flex items-center justify-between py-3"
                aria-label="Navigation de la pagination"
            >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                    Affichage{" "}
                    <span className="font-semibold">
                        {filteredData.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}
                        -
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredData.length)}
                    </span>{" "}
                    sur <span className="font-semibold">{filteredData.length}</span> resultats
                </span>

                <ul className="inline-flex items-center space-x-1">
                    <li>
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
                            aria-label="Page précédente"
                        >
                            Precedent
                        </button>
                    </li>

                    {[...Array(totalPages)].map((_, idx) => {
                        const page = idx + 1;
                        return (
                            <li key={page}>
                                <button
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-1 rounded border hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600 ${currentPage === page
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "border-gray-300 text-gray-700 dark:text-gray-300"
                                        }`}
                                    aria-current={currentPage === page ? "page" : undefined}
                                >
                                    {page}
                                </button>
                            </li>
                        );
                    })}

                    <li>
                        <button
                            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700"
                            aria-label="Page suivante"
                        >
                            Suivant
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default ProductTablePagination;
