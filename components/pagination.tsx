"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type PaginationProps = {
  totalPages: number;
};

export default function Pagination({ totalPages }: PaginationProps) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page") || 1);

  const buildQuery = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `?${params.toString()}`;
  };

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const [inputValue, setInputValue] = useState(currentPage.toString());

  useEffect(() => {
    setInputValue(currentPage.toString());
  }, [currentPage]);

  return (
    <nav aria-label="pagination" className="m-10 flex justify-center items-center">
      <Link
        href={buildQuery(currentPage - 1)}
        className={`py-1 px-3 w-[125px] border rounded-l-md hover:bg-accent text-center ${
          !hasPrevious && "pointer-events-none cursor-not-allowed bg-accent"
        }`}
        aria-disabled={!hasPrevious}
        tabIndex={hasPrevious ? 0 : -1}
      >
        &lt; Previous
      </Link>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        aria-label="Go to page"
        className="w-10 py-1 text-center border rounded outline-none focus:ring focus:ring-orange-500 hover:ring hover:ring-orange-500 focus:placeholder:text-white z-1"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            router.push(buildQuery(Number((e.target as HTMLInputElement).value)));

          }
        }}
      />
      <Link
        href={buildQuery(currentPage + 1)}
        className={`py-1 px-3 w-[125px] border rounded-r-md hover:bg-accent text-center ${!hasNext && "pointer-events-none cursor-not-allowed bg-accent"}`}
        aria-disabled={!hasNext}
        tabIndex={hasNext ? 0 : -1}
      >
        Next &gt; 
      </Link>
    </nav>
  );
}
