import { NextResponse } from 'next/server';
import { paginateItems, fetchFirestoreDocument, GPUIndexItem } from '@/lib/db-services/db-utils'; // Assuming db-utils is in this path

// --- Constants ---
const ITEMS_PER_PAGE = 20;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// --- Cache State ---
let gpuItemsCache: GPUIndexItem[] | null = null;
let cacheLastUpdated: number | null = null; //

// --- Helper Functions ---
async function getGPUItems(currentTime: number): Promise<GPUIndexItem[]> {
  const isCacheStale = !cacheLastUpdated || (currentTime - cacheLastUpdated > CACHE_TTL_MS);

  if (isCacheStale || !gpuItemsCache) {
    const data = await fetchFirestoreDocument<{ Items: GPUIndexItem[] }>('search-index', 'gpu-index');

    gpuItemsCache = data?.Items || [];

    cacheLastUpdated = currentTime; // Update timestamp only on successful fetch or attempt
    console.log("✅ GPU search data fetched and cached.");
  } else {
    console.log("✅ Using gpu search data cache.");
  }
  return gpuItemsCache;
}

// --- Main GET Handler ---
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manufacturerParam = searchParams.get('manf') || 'all';
  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);
  const currentTime = Date.now();

  try {
    const allGpuItems = await getGPUItems(currentTime);

    const filteredItems = manufacturerParam == 'all'? allGpuItems : allGpuItems.filter(item => item.Name.toLowerCase().includes(manufacturerParam));
    const { paginatedItems, totalPages } = paginateItems(filteredItems, pageParam, ITEMS_PER_PAGE);

    const responseData = {
      items: paginatedItems,
      totalPages: totalPages,
      currentPage: pageParam,
    };

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("Error in GET GPU items API:", error);
    return NextResponse.json({ error: 'Failed to retrieve GPU data. Please try again later.' }, { status: 500 });
  }
}