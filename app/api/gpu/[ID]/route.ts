import { NextRequest, NextResponse } from "next/server";
import { fetchFirestoreDocument } from "@/lib/db-services/db-utils";

// In-memory LRU Cache for gpu data
const gpuLRUCache = new Map<string, unknown>(); // Map<ID, gpuData>
const CACHE_CAPACITY = 50; // Example: Cache up to 5 gpus (adjust based on monitoring)
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL for cache entries

// We store the timestamp of when the item was last put into cache
const gpuCacheTimestamps = new Map<string, number>();

export async function GET(request: NextRequest, { params }: { params: Promise<{ ID: string }> }) {
  const { ID } = await params;
  const currentTime = Date.now();

  try {
    const cachedData = gpuLRUCache.get(ID);
    const lastCachedTime = gpuCacheTimestamps.get(ID);

    // Check if data exists AND is not expired
    if (cachedData && lastCachedTime && (currentTime - lastCachedTime < CACHE_TTL_MS)) {
      console.log(`🚀 Serving GPU data for ID: ${ID} from LRU cache (TTL OK)`);

      gpuLRUCache.delete(ID);
      gpuLRUCache.set(ID, cachedData);

      return NextResponse.json(cachedData);
    }
    // Fetch the gpu document by ID
    const gpuData = await fetchFirestoreDocument('gpus', ID);

    if (!gpuData) {
      if (gpuLRUCache.has(ID)) {
        gpuLRUCache.delete(ID);
        gpuCacheTimestamps.delete(ID);
      }
      return NextResponse.json({ error: 'gpu not found' }, { status: 404 });
    }

    // If cache is full, evict the least recently used item
    if (gpuLRUCache.size >= CACHE_CAPACITY) {
      const leastRecentlyUsedKey = gpuLRUCache.keys().next().value;
      if (leastRecentlyUsedKey !== undefined) {
        gpuLRUCache.delete(leastRecentlyUsedKey);
        gpuCacheTimestamps.delete(leastRecentlyUsedKey);
        console.log(`🗑️ Evicted LRU gpu ID: ${leastRecentlyUsedKey}`);
      }
    }

    // Add the new gpu data to the cache
    gpuLRUCache.set(ID, gpuData);
    gpuCacheTimestamps.set(ID, currentTime);
    console.log(`🔍 Fetched and cached gpu data for ID: ${ID}`);

    return NextResponse.json(gpuData);
  } catch (error) {
    console.error("Error fetching gpu data:", error);
    return NextResponse.json({ error: 'Failed to retrieve gpu data. Please try again later.' }, { status: 500 });
  }
}