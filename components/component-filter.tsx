"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ComponentFilter({ manf }: { manf: string }) {
  const searchParams = useSearchParams();
  const manfParam = searchParams.get("manf") || "all"; 
  
  const isActive = manfParam?.toLowerCase() === manf.toLowerCase();

  return (
    <Link
      key={manf}
      href={`?manf=${manf.toLowerCase()}`}
      className={`px-4 py-1 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "bg-white text-black shadow"
          : "text-muted-foreground hover:bg-white/30"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {manf}
    </Link>
  );
}
