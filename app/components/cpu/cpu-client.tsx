"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import BreadCrumbNavigation from "@/components/breadcrumb-nav";
import Pagination from "@/components/pagination";
import SearchProductCard from "@/components/search-product-card";
import ComponentFilter from "@/components/component-filter";

type cpuSchema = {
  ID: string;
  Name: string;
  Cores: number;
  Threads: number;
  "Boost Clock Frequency": string;
  "L3 Cache": string;
  "Image URL": string;
};

export default function CpuPage() {
  const params = useSearchParams();

  const manfParam = params.get("manf") || "all"; // Default to "all" if not provided
  const pageParam = params.get("page") || 1; // Default to page 1 if not provided

  const [cpus, setCpus] = useState<cpuSchema[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchCPUs() {
      try{
        const res = await fetch(`/api/cpu?manf=${manfParam}&page=${pageParam}`);
        const data = await res.json();
        setCpus(data.items);
        setTotalPages(data.totalPages);
      }
      catch (error) {
        console.error("Error fetching CPUs:", error);
      }
    }
    fetchCPUs();
  }, [manfParam, pageParam]);

  return (
    <main className="mt-25 mx-5 md:mx-15">
      {/* CPU Navigation */}
      <nav className="mb-10 flex justify-center" aria-label="cpu-navigation">
        <div className="inline-flex items-center justify-center gap-1 bg-muted border rounded-md p-1">
          {["All", "AMD", "Intel"].map((manf) => (
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
          { name: "CPU" }, // Current page
        ]}
      />

      {/* CPU List */}
      <section aria-label="cpu-list">
        {cpus.map((cpu) => (
          <SearchProductCard
            key={cpu.ID}
            product={{
              type: "cpu",
              ID: cpu.ID,
              Name: `${cpu.Name} ${cpu.Cores}C/${cpu.Threads}T ${cpu["Boost Clock Frequency"]} Mhz Processor Speed ${cpu["L3 Cache"]} L3 Cache`,
              Description: [
                ["Processor Type", cpu.Name.match(/(?:Ryzen\s\d|Core\s[im]\d)/i)?.[0] || "Unknown"],
                ["Cores/Threads", `${cpu.Cores}C/${cpu.Threads}T`],
                ["Boost Clock Frequency", cpu["Boost Clock Frequency"]],
                ["L3 Cache", cpu["L3 Cache"]],
              ],
              "Image URL": cpu["Image URL"],
            }}
          />
        ))}
        
        {/* Pagination */}
        <Pagination totalPages={totalPages} />
      </section>
    </main>
  );
}
