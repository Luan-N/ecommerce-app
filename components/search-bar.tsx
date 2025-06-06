"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

type ProductSchema = {
  type: string; // 'cpu' or 'gpu'
  ID: string;
  Name: string;
  Description: [string, string][];
  "Image URL": string;
};

// -- Helper Functions --
const highlightMatch = (text: string, query: string) => {
  if (!query) {
    return <>{text}</>;
  }
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const startIndex = lowerText.indexOf(lowerQuery);

  if (startIndex === -1) {
    return <>{text}</>;
  }

  const before = text.substring(0, startIndex);
  const match = text.substring(startIndex, startIndex + query.length);
  const after = text.substring(startIndex + query.length);

  return (
    <>
      {before}
      <span className="text-orange-600">{match}</span>
      {after}
    </>
  );
};

const DEBOUNCE_DELAY = 300;

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSchema[]>([]);

  function fullSearch(searchQuery: string, page: number) { // Renamed query to searchQuery to avoid conflict
    if (!searchQuery || searchQuery.trim() === "") return;
    router.push(
      `/components/full-search?query=${encodeURIComponent(searchQuery)}&page=${page}`
    );
    setQuery(""); // Clear the input field
  }

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timerId = setTimeout(async () => {
      if(query.length == 0) return;
      try {
        const res = await fetch(
          `/api/live-search?query=${encodeURIComponent(query)}`
        );
        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timerId);
    };
  }, [query]);

  return (
    <div className="flex">
      {/* Search Bar */}
      <div
        id="search-bar"
        className="flex relative items-center w-full mx-2 sm:mx-6 border rounded-sm border-gray-300 peer"
      >
        <input
          type="text"
          name="query"
          placeholder="Search components..."
          className="flex-grow px-3 h-9 rounded-l-sm focus:outline-none text-sm focus:bg-accent"
          value={query} // Ensure input field is controlled by the query state
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.length > 0) {
              fullSearch(query, 1);
            }
          }}
        />
        <Link
          href={`/components/full-search?query=${query}&page=1`}
          onClick={() => fullSearch(query, 1)}
          className="w-10 h-9 transition-colors cursor-pointer flex justify-center items-center "
        >
          <CiSearch className="text-xl text-black hover:text-orange-600 hover:text-2xl transition-all duration-200" />
        </Link>
      </div>
      {/* Results Dropdown */}
      {results.length > 0 && (
        <ul className="absolute top-12 mt-2 w-[300px] px-7 space-y-1">
          {results.map((item) => (
            <li
              key={item.ID}
              className="flex items-center space-x-3 p-2 border rounded bg-white shadow-sm h-16"
            >
              <Link
                href={`/components/${item.type}/${item.ID}`}
                onClick={() => setQuery("")} // Clear the input when navigating
                className="flex items-center space-x-3 group"
              >
                <Image
                  src={item["Image URL"]}
                  alt={item.Name}
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                  {highlightMatch(item.Name, query)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}