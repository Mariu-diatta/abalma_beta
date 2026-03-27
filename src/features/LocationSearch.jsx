import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const LocationSearchPopover = ({ setLocationSearch}) => {
    const [query, setQuery] = useState("");               // Texte recherché
    const [results, setResults] = useState([]);           // Résultats API
    const [selectedLocation, setSelectedLocation] = useState(""); // Lieu sélectionné
    const [isOpen, setIsOpen] = useState(false);          // État popover

    const inputRef = useRef(null);

    useEffect(() => {
        if (selectedLocation) {
            setLocationSearch(selectedLocation); // ← seulement quand selectedLocation change
        }
    }, [selectedLocation, setLocationSearch]); 

    const searchLocation = async () => {
        if (!query) return;

        try {
          const response = await axios.get(
            "https://nominatim.openstreetmap.org/search",
            {
              params: {
                q: query,
                format: "json",
                addressdetails: 1,
                limit: 10,
              },
            }
          );

          setResults(response.data);
          setIsOpen(true); // ouvre le popover
        } catch (error) {
          console.error("Erreur recherche lieu :", error);
        }

        setSelectedLocation(query);
   };

  const handleSelect = (place) => {
    const locationString = `${place.display_name} | Lat:${place.lat}, Lon:${place.lon}`;
    setSelectedLocation(locationString ?? query);
    setIsOpen(false); // fermer le popover après sélection
    setQuery(place.display_name); // afficher le lieu choisi dans l'input
  };

  return (
      <div className="relative w-full mx-auto mt-4 py-3">

          <div className="relative  mx-auto mt-4 flex border-0 border-gray-50 focus:ring-0">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value)
                    //searchLocation()
                }}
                onFocus={(e) => e.target.value.length === 0 && setIsOpen(false)}
                placeholder="Entrez un lieu..."
                className="w-full border p-2 rounded border-0 border-b border-b-gray-100 focus:outline-none "
                required="true"
              />

              <span
                onClick={searchLocation}
                className="absolute right-2 top-1/2 -translate-y-1/2  text-white px-2 py-1  border-0"
              >
                  <svg className="w-[33px] h-[33px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeWidth="1" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" />
                  </svg>

              </span>
          </div>

          {/* Popover */}
          {isOpen && results?.length > 0 && (
            <div className="absolute w-full z-20  mt-1 max-h-64 overflow-y-auto border border-gray-100 bg-white rounded shadow-lg">

                  {
                      results?.map((place) => (
                        <div
                          key={place?.place_id}
                          onClick={() => handleSelect(place)}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <p className="font-semibold">{place?.name || place?.display_name}</p>
                          <p className="text-xs text-gray-600">{place?.display_name}</p>
                        </div>
                    ))
                  }

            </div>
          )}

          {selectedLocation && (
            <div className="mt-2 p-2 border border-gray-100 rounded bg-green-50">
              <strong>Lieu sélectionné :</strong>
              <p className="text-sm">{selectedLocation}</p>
            </div>
          )}
    </div>
  );
};

export default LocationSearchPopover;