"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ComponentFilter({ k, v }: { k: string, v: string }) {
  const searchParams = useSearchParams();
  const currentParamValue = searchParams.get(k) || "all";

  const isActive = currentParamValue?.toLowerCase() === v.toLowerCase();

  // 1. Create a mutable copy of the current search parameters.
  const params = new URLSearchParams(searchParams.toString());

  params.set(k, v.toLowerCase());

  // 3. Generate the new search string.
  const href = `?${params.toString()}`;

  return (
    <Link
      key={v}
      href={href}
      className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "bg-white text-black shadow"
          : "text-muted-foreground hover:bg-white/30"
      }`}
      aria-current={isActive ? "page" : undefined}
      // It's good practice to scroll to the top when filters change.
      scroll={false} 
    >
      {v}
    </Link>
  );
}