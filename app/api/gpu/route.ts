import { NextResponse } from 'next/server';
import { paginateItems, fetchFirestoreDocument, GPUIndexItem } from '@/lib/db-services/db-utils'; // Assuming db-utils is in this path


// --- Constants ---
const ITEMS_PER_PAGE = 20;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const MANUFACTURER_FILTER_KEYWORDS: Record<string, string | undefined> = {
  nvidia: 'nvidia',
  amd: 'amd',
  intel: 'intel',
};

// --- Cache State ---
let gpuItemsCache: GPUIndexItem[] | null = null;
let cacheLastUpdated: number | null = null; //

// --- Helper Functions ---
async function getGPUItems(currentTime: number): Promise<GPUIndexItem[]> {
  const isCacheStale = !cacheLastUpdated || (currentTime - cacheLastUpdated > CACHE_TTL_MS);

  if (isCacheStale || !gpuItemsCache) {
    console.log("Attempting to fetch GPU data from Firestore.");
    const data = await fetchFirestoreDocument<{ Items: GPUIndexItem[] }>('search-index', 'gpu-index');
    
    gpuItemsCache = data?.Items || []; 
    
    cacheLastUpdated = currentTime; // Update timestamp only on successful fetch or attempt
    console.log(`✅ GPU data fetched/refreshed. Cache updated. Items count: ${gpuItemsCache.length}`);
  } else {
    console.log("✅ Using cached GPU data.");
  }
  return gpuItemsCache;
}

function filterItemsByManufacturer(items: GPUIndexItem[], manufacturer: string | null): GPUIndexItem[] {
  if (!manufacturer) {
    return items;
  }
  
  const lowerManf = manufacturer.toLowerCase();
  const filterKeyword = MANUFACTURER_FILTER_KEYWORDS[lowerManf];

  if (filterKeyword) {
    return items.filter(item => item.Name.toLowerCase().includes(filterKeyword));
  }

  return items; 
}

// --- Main GET Handler ---
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manufacturerParam = searchParams.get('manf');
  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);
  const currentTime = Date.now();

  try {
    const allGpuItems = await getGPUItems(currentTime);

    const filteredItems = filterItemsByManufacturer(allGpuItems, manufacturerParam);
    const { paginatedItems, totalPages } = paginateItems(filteredItems, pageParam, ITEMS_PER_PAGE);

    const responseData = {
      items: paginatedItems,
      totalPages: totalPages,
      currentPage: pageParam,
    };

    return NextResponse.json(responseData);

  } catch (error: any) {
    console.error("Error in GET GPU items API:", error.message, error.stack); 
    return NextResponse.json({ error: 'Failed to retrieve GPU data. Please try again later.' }, { status: 500 });
  }
}