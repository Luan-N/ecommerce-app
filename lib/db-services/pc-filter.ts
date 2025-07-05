import { paginateItems, PCIndexItem } from '@/lib/db-services/search-utils';
import { fetchFirestoreDocument } from '@/lib/db-services/firestore-db'; // Assuming db-utils is in this path

// --- Constants ---
const ITEMS_PER_PAGE = 5;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// --- Cache State ---
let pcItemsCache: PCIndexItem[] | null = null;
let cacheLastUpdated: number | null = null; //

// --- Helper Functions ---
async function getPCItems(currentTime: number): Promise<PCIndexItem[]> {
  const isCacheStale = !cacheLastUpdated || (currentTime - cacheLastUpdated > CACHE_TTL_MS);

  if (isCacheStale || !pcItemsCache) {
    const data = await fetchFirestoreDocument<{ Items: PCIndexItem[] }>('search-index', 'pc-index');

    pcItemsCache = data?.Items || [];

    cacheLastUpdated = currentTime; // Update timestamp only on successful fetch or attempt
    console.log("✅ PC search data fetched and cached.");
  } else {
    console.log("✅ Using PC search data cache.");
  }
  return pcItemsCache;
}

// --- Main GET Handler ---
export async function getPCFilteredItems(tier: string | "all", cpuType: string | "all", gpuType: string | "all", pageParam: number | 1) {
  const currentTime = Date.now();

  try {
    const allPcItems = await getPCItems(currentTime);

    //filter by tier
    const tierFilter = tier == "all" ? allPcItems : allPcItems.filter(item => item.Tier.toLowerCase() === tier.toLowerCase());

    return tierFilter;

  } catch (error) {
    console.error("Error in GET PC items API:", error);
    throw error;
  }
}