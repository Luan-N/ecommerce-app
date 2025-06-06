import { NextResponse } from 'next/server';
import { paginateItems, fetchFirestoreDocument, CPUIndexItem } from '@/lib/db-services/db-utils';


// --- Constants ---
const ITEMS_PER_PAGE = 20;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// --- Cache State ---
let cpuItemsCache: CPUIndexItem[] | null = null;
let cacheLastUpdated: number | null = null;

// --- Helper Functions ---
async function getCPUItems(currentTime: number): Promise<CPUIndexItem[]> {
  const isCacheStale = !cacheLastUpdated || (currentTime - cacheLastUpdated > CACHE_TTL_MS);

  // Refetch if cache is stale or if the cache is not populated for some reason
  if (isCacheStale || !cpuItemsCache) {

    const data = await fetchFirestoreDocument<{Items: CPUIndexItem[]}>('search-index', 'cpu-index');
    cpuItemsCache = data?.Items || [];

    cacheLastUpdated = currentTime; // Update timestamp only on successful fetch
    console.log("✅ CPU search data fetched and cached.");
  } else {
    console.log("✅ Using CPU search data cache.");
  }
  return cpuItemsCache;
}

// --- Main GET Handler ---
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manufacturerParam = searchParams.get('manf') || 'all';

  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);
  const currentTime = Date.now();

  try {
    const allCpuItems = await getCPUItems(currentTime);

    const filteredItems = manufacturerParam == 'all' ? allCpuItems : allCpuItems.filter(item => item.Name.toLowerCase().includes(manufacturerParam));

    const { paginatedItems, totalPages } = paginateItems(filteredItems, pageParam, ITEMS_PER_PAGE);

    const responseData = {
      items: paginatedItems,
      totalPages: totalPages,
      currentPage: pageParam, // Optionally include current page in response
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error in GET CPU items API:", error);
    return NextResponse.json({ error: 'Failed to retrieve CPU data. Please try again later.' }, { status: 500 });
  }
}