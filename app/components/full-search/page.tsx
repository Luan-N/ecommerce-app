"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import BreadCrumbNavigation from "@/components/breadcrumb-nav";
import Pagination from "@/components/pagination";
import SearchProductCard from "@/components/search-product-card";

type productSchema = {
  type: string;
  ID: string;
  Name: string;
  Description: [string, string][];
  "Image URL": string;
};

export default function FullSearchPage() {
  const params = useSearchParams();
  const queryParam = params.get("query") || ""; // Default to empty string if not provided
  const pageParam = params.get("page") || 1; // Default to page 1 if not provided

  const [products, setProducts] = useState<productSchema[]>([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        const res = await fetch(
          `/api/full-search?query=${encodeURIComponent(queryParam)}&page=${pageParam}`
        );
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
        const data = await res.json();
        setProducts(data.items || []);
        setTotalPages(data.totalPages || 0);
        console.log("Search results fetched:", data.items);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
    fetchSearchResults();
  }, [queryParam]);

  return (
    <main className="mt-25 mx-5 md:mx-15">
        {/* Page Navigation */}
      <Pagination totalPages={totalPages} />

      <h2 className="font-medium text-xl">Search Results for "{queryParam}"</h2>

      {/* BreadCrumb */}
      <BreadCrumbNavigation
        items={[
          { name: "Home", href: "/" },
          { name: "Components", href: `/components` },
          { name: "Full Search" },
        ]}
      />

      {/* Search Product Cards */}
      <section>
        {products.map((product) => (
        <SearchProductCard key={product.ID} product={product} />
      ))}
      </section>
      
      {/* Page Navigation */}
        <Pagination totalPages={totalPages} />
    </main>
  );
}
