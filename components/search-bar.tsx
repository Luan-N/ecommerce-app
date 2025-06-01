"use cleint";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";

type ProductSchema = {
  ID: string;
  Name: string;
  Description: [string, string][];
  "Image URL": string;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductSchema[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    async function fetchResults() {
      try {
        const res = await fetch(
          `/api/live-search?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    }
    fetchResults();
  }, [query]);

  return (
    <div className="flex">
      <form className="flex relative items-center w-full mx-7 border rounded-sm border-gray-300 focus:border-1 focus:border-orange-600">
        <input
          type="text"
          name="query"
          placeholder="Search components..."
          className="flex-grow px-3 h-9 rounded-l-sm focus:outline-none text-sm"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="w-10 h-9 transition-colors cursor-pointer flex justify-center items-center"
        >
          <CiSearch className="text-xl text-black hover:text-orange-600 hover:text-2xl transition-all duration-200" />
        </button>
      </form>
      {results.length > 0 && (
        <ul className="absolute top-12 mt-2 w-[300px] px-7 space-y-1 ">
          {results.map((item) => (
            <li
              key={item.ID}
              className="flex items-center space-x-3 p-2 border rounded bg-white shadow-sm h-16"
            >
              <Link
                href={`/components/${item.ID}`}
                className="flex items-center space-x-3 group"
              >
                <img
                  src={item["Image URL"]}
                  alt={item.Name}
                  className="w-12 h-12 object-contain"
                />
                <span className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">
                  {item.Name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
