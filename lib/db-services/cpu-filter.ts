import { paginateItems, CPUIndexItem } from '@/lib/db-services/search-utils';
import { fetchFirestoreDocument } from '@/lib/db-services/firestore-db';

// --- Constants ---
const ITEMS_PER_PAGE = 20;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// --- Cache State ---
let cpuItemsCache: CPUIndexItem[] | null = null;
let cacheLastUpdated: number | null = null;

// --- Helper Functions ---
async function getComponentItems(currentTime: number): Promise<CPUIndexItem[]> {
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
export async function getCPUFilteredItems(manufacturerParam: string | "all", pageParam: number | 1) {
  const currentTime = Date.now();

  try {
    const allCpuItems = await getComponentItems(currentTime);

    const filteredItems = manufacturerParam == "all" ? allCpuItems : allCpuItems.filter(item => item.Name.toLowerCase().includes(manufacturerParam));

    const { paginatedItems, totalPages } = paginateItems(filteredItems, pageParam, ITEMS_PER_PAGE);

    return {paginatedItems, totalPages, pageParam};

  } catch (error) {
    console.error("Error in GET CPU items API:", error);
    throw error;
  }
}