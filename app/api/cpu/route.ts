import { NextResponse } from 'next/server';
import { paginateItems, fetchFirestoreDocument, CPUIndexItem } from '@/lib/db-services/db-utils';


// --- Constants ---
const ITEMS_PER_PAGE = 20;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const MANUFACTURER_FILTER_KEYWORDS: Record<string, string | undefined> = {
  amd: 'ryzen',
  intel: 'intel',
};

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
    console.log("✅ CPU data fetched/refreshed and cached.");
  } else {
    console.log("✅ Using cached CPU data.");
  }
  return cpuItemsCache;
}

function filterItemsByManufacturer(items: CPUIndexItem[], manufacturer: string | null): CPUIndexItem[] {
  if (!manufacturer) 
    return items;
  
  const lowerManf = manufacturer.toLowerCase();
  const filterKeyword = MANUFACTURER_FILTER_KEYWORDS[lowerManf];

  if (filterKeyword) 
    return items.filter(item => item.Name.toLowerCase().includes(filterKeyword));

  return items;
}

// --- Main GET Handler ---
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manufacturerParam = searchParams.get('manf');

  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);
  const currentTime = Date.now();

  try {
    const allCpuItems = await getCPUItems(currentTime);

    const filteredItems = filterItemsByManufacturer(allCpuItems, manufacturerParam);

    const { paginatedItems, totalPages } = paginateItems(filteredItems, pageParam, ITEMS_PER_PAGE);

    const responseData = {
      items: paginatedItems,
      totalPages: totalPages,
      currentPage: pageParam, // Optionally include current page in response
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error("Error in GET CPU items API:", error.message, error.stack);
    return NextResponse.json({ error: 'Failed to retrieve CPU data. Please try again later.' }, { status: 500 });
  }
}