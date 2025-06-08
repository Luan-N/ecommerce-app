import BreadCrumbNavigation from "@/components/breadcrumb-nav";
import Pagination from "@/components/pagination";
import SearchProductCard from "@/components/search-product-card";
import { getSearchItems } from "@/lib/db-services/search-utils";

type productSchema = {
  type: string;
  ID: string;
  Name: string;
  Description: [string, string][];
  "Image URL": string;
};

export default async function FullSearchPage({searchParams}: {searchParams: {query?: string, page?: string}}) {
  const params = await searchParams; // Ensure searchParams is awaited
  const queryParam = params.query || ""; // Default to empty string if not provided
  const pageParam = params.page || 1; // Default to page 1 if not provided

  const response = await getSearchItems(queryParam, Number(pageParam));
  interface SearchResponse {
    items: productSchema[];
    totalPages: number;
    currentPage: number;
  }

  const { items, totalPages } = await response as SearchResponse;

  return (
    <main className="mt-25 mx-5 md:mx-15">
        {/* Page Navigation */}
      <Pagination totalPages={totalPages} />

      <h2 className="font-medium text-xl">Search Results for &quot;{queryParam}&quot;</h2>

      {/* BreadCrumb */}
      <BreadCrumbNavigation
        items={[
          { name: "Home", href: "/" },
          { name: "Components", href: `/components` },
          { name: "Full Search" },
        ]}
      />
      
      {/* No Search Result */}
      {!items || items.length === 0 && (
        <div className="text-center mt-10">
          <h3 className="text-lg font-semibold">No results found</h3>
          <p className="text-sm text-muted-foreground">Try searching for something else.</p>
        </div>
      )}

      {/* Search Product Cards */}
      <section>
        {items && items.length > 0 && items.map((product) => (
        <SearchProductCard key={product.ID} product={product} />
      ))}
      </section>
      
      {/* Page Navigation */}
        <Pagination totalPages={totalPages} />
    </main>
  );
}
