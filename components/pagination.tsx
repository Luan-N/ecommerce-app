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
  useEffect(() => setInputValue(currentPage.toString()), [currentPage]);

  return (
    <nav aria-label="pagination" className="my-6 flex justify-center items-center">
      {/* Previous */}
      <Link
        href={buildQuery(currentPage - 1)}
        className={`
          px-4 py-2 text-sm sm:text-base w-[120px] text-center
          border border-gray-300 bg-white 
          rounded-l-full hover:bg-gray-100 transition-colors 
          ${!hasPrevious ? 'pointer-events-none opacity-50' : ''}
        `}
        aria-disabled={!hasPrevious}
      >
        &lt; Previous
      </Link>

      {/* Page Input */}
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') router.push(buildQuery(Number((e.target as HTMLInputElement).value)));
        }}
        aria-label="Go to page"
        className={`
          w-12 py-2 text-center text-sm sm:text-base z-1
          border-t border-b border-gray-300 bg-white 
          focus:outline-none focus:ring-2 focus:ring-orange-500
        `}
      />

      {/* Next */}
      <Link
        href={buildQuery(currentPage + 1)}
        className={`
          px-4 py-2 text-sm sm:text-base w-[120px] text-center
          border border-gray-300 bg-white 
          rounded-r-full hover:bg-gray-100 transition-colors 
          ${!hasNext ? 'pointer-events-none opacity-50' : ''}
        `}
        aria-disabled={!hasNext}
      >
        Next &gt;
      </Link>
    </nav>
  );
}

