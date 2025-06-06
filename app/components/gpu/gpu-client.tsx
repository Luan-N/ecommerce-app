"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import BreadCrumbNavigation from "@/components/breadcrumb-nav";
import Pagination from "@/components/pagination";
import SearchProductCard from "@/components/search-product-card";
import ComponentFilter from "@/components/component-filter";

type gpuSchema = {
  ID: string;
  Name: string;
  "Memory Size": string;
  "Memory Type": string;
  "Boost Clock": string;
  "Image URL": string;
};

export default function GpuPages() {
  const params = useSearchParams();

  const manfParam = params.get("manf") || "all"; // Default to "all" if not provided
  const pageParam = params.get("page") || 1; // Default to page 1 if not provided

  const [gpus, setGpus] = useState<gpuSchema[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchGPUs() {
      const res = await fetch(`/api/gpu?manf=${manfParam}&page=${pageParam}`);
      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error:", errorData.error || "Unknown error");
        return;
      }
      const data = await res.json();
      setGpus(data.items);
      setTotalPages(data.totalPages);
    }
    fetchGPUs();
  }, [manfParam, pageParam]);

  return (
    <main className="mt-25 mx-5 md:mx-15">
      {/* GPU Navigation */}
      <nav className="mb-10 flex justify-center" aria-label="cpu-navigation">
        <div className="inline-flex items-center justify-center gap-1 bg-muted border rounded-md p-1">
          {["All", "AMD", "NVIDIA"].map((manf) => (
            <ComponentFilter
              key={manf}
              manf={manf}
            />
          ))}
        </div>
      </nav>

      {/* Pagination */}
      <Pagination totalPages={totalPages} />

      {/* Bread Crumb */}
      <BreadCrumbNavigation
        items={[
          { name: "Home", href: "/" },
          { name: "Components", href: "/Components" },
          { name: "GPU" }, // Current page
        ]}
      />

      {/* GPU List */}
      <section aria-label="cpu-list">
        {gpus.map((gpu) => (
          <SearchProductCard
            key={gpu.ID}
            product={{
              type: "gpu",
              ID: gpu.ID,
              Name: `${gpu.Name} ${gpu["Memory Size"]} ${gpu["Memory Type"]} ${gpu["Boost Clock"]} Boost Clock`,
              Description: [
                ["Memory Size", gpu["Memory Size"]],
                ["Boost Clock Frequency", gpu["Boost Clock"]],
                ["Memory Type", gpu["Memory Type"]],
              ],
              "Image URL": gpu["Image URL"],
            }}
          />
        ))}
        
        {/* Pagination */}
        <Pagination totalPages={totalPages} />
      </section>
    </main>
  );
}
