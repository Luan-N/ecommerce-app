import BreadCrumbNavigation from "@/components/breadcrumb-nav";
import Pagination from "@/components/pagination";
import SearchProductCard from "@/components/search-product-card";
import ComponentFilter from "@/components/item-filter";
import { getCPUFilteredItems } from "@/lib/db-services/cpu-filter";

export default async function CpuPage({searchParams}: { searchParams: { manf?: string, page?: string } }) {
  const params = await searchParams; // Ensure searchParams is awaited
  const manf = params.manf || "all"
  const page = params.page || 1;

  const { paginatedItems: cpus, totalPages } = await getCPUFilteredItems(manf, Number(page));

  return (
    <main className="mt-25 mx-5 md:mx-15">
      {/* CPU Navigation */}
      <nav className="mb-10 flex justify-center" aria-label="cpu-navigation">
        <div className="inline-flex items-center justify-center gap-1 bg-muted border rounded-md p-1">
          {["All", "AMD", "Intel"].map((manf) => (
            <ComponentFilter
              v={manf}
              k="manf"
              key={manf}
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
