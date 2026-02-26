import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function TabsButtons({ tabs, activeTab, setActiveTab }) {

  const scrollRef = useRef(null);

  const scroll = (direction) => {

    const container = scrollRef.current;

    if (!container) return;

    const scrollAmount = 200; // distance en px

    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (

    <div className="relative w-full">

      {/* Bouton gauche */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-1 hidden"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Container scrollable */}
      <div
        ref={scrollRef}
        className="overflow-x-auto px-5 scrollbor_hidden_ bg-none"
      >

        <section className="flex py-2 gap-5 bg-none">

        {
            tabs?.map((tab) => (
              <button
                type="button"
                key={tab?.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${tab.id}-tab`}
                id={`${tab.id}-tab-button`}
                onClick={() => setActiveTab(tab.id)}
                className={`text-md dark:text-white text-gray-600 border border-gray-100 whitespace-nowrap cursor-pointer rounded-full px-3 py-1 hover:bg-gray-50
                ${activeTab === tab.id ? "bg-gradient-to-l from-red-50 to-gray-200" : ""}`}
              >
                {tab?.label}
              </button>
            ))
        }

        </section>

      </div>

      {/* Bouton droite */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full p-1 hidden"
      >
        <ChevronRight size={18} />
      </button>

    </div>
  );
}

export default TabsButtons;