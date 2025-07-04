import ComponentFilter from "@/components/item-filter";
import React from "react";

import PCSelectionCarousel from "@/components/pc-selection-carousel";

export default function Products() {
  return (
    <main className="mt-25 mx-5 md:mx-15">
      {/* Navigation */}
      {/* <nav
        className="mb-10 flex justify-center flex-col sm:flex-row sm:gap-x-20"
        aria-label="pc-navigation"
      >
        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">CPU</h2>
          <div className="inline-flex items-center justify-center gap-1 bg-muted border rounded-md p-1">
            {["All", "AMD", "Intel"].map((manf) => (
              <ComponentFilter k="cpu" v={manf} key={manf} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">GPU</h2>
          <div className="inline-flex items-center justify-center gap-1 bg-muted border rounded-md p-1">
            {["All", "AMD", "NVIDIA"].map((manf) => (
              <ComponentFilter k="gpu" v={manf} key={manf} />
            ))}
          </div>
        </div>

      </nav> */}
      <PCSelectionCarousel tier="Entry" description="Budget option for those who want a good balance of performance and price." />
      <PCSelectionCarousel tier="Mid-Range" description="Great performance for the price, ideal for gamers." />
      <PCSelectionCarousel tier="High-End" description="Top-tier components for the best performance." />
      <PCSelectionCarousel tier="Flagship" description="The best of the best, no compromises." />
    </main>
  );
}
