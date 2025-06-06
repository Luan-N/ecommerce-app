import { Suspense } from "react";
import CpuClientComponent from "./full-search-client";
import { Skeleton } from "@/components/ui/skeleton"; // Example loading UI

// This is now a Server Component
export default function FullSearchPage() {
  return (
    // Suspense provides a fallback while the client component loads
    <Suspense fallback={<LoadingSkeleton />}>
      <CpuClientComponent />
    </Suspense>
  );
}

// A simple loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="p-4">
      <Skeleton className="h-12 w-1/4 mx-auto mb-8" />
      <Skeleton className="h-8 w-1/2 mb-4" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  );
}