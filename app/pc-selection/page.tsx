import ComponentFilter from "@/components/item-filter";
import React from "react";

import PCSelectionCarousel from "@/components/pc-selection-carousel";

export default function Products() {
  return (
    <main className="mt-25 mx-5 md:mx-15">
      <PCSelectionCarousel tier="Entry" description="Budget option for those who want a good balance of performance and price." />
      <PCSelectionCarousel tier="Mid-Range" description="Great performance for the price, ideal for gamers." />
      <PCSelectionCarousel tier="High-End" description="Top-tier components for the best performance." />
      <PCSelectionCarousel tier="Flagship" description="The best of the best, no compromises." />
    </main>
  );
}
