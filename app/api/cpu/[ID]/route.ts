import { NextRequest, NextResponse } from "next/server";
import { fetchFirestoreDocument } from "@/lib/db-services/db-utils";

// In-memory LRU Cache for cpu data
const cpuLRUCache = new Map<string, unknown>(); // Map<ID, cpuData>
const CACHE_CAPACITY = 50; // Example: Cache up to 5 cpus (adjust based on monitoring)
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL for cache entries

// We store the timestamp of when the item was last put into cache
const cpuCacheTimestamps = new Map<string, number>();

export async function GET(request: NextRequest, { params }: { params: { ID: string } }) {
  const { ID } = await params;
  const currentTime = Date.now();

  try {
    const cachedData = cpuLRUCache.get(ID);
    const lastCachedTime = cpuCacheTimestamps.get(ID);

    // Check if data exists AND is not expired
    if (cachedData && lastCachedTime && (currentTime - lastCachedTime < CACHE_TTL_MS)) {
      console.log(`🚀 Serving CPU data for ID: ${ID} from LRU cache (TTL OK)`);

      cpuLRUCache.delete(ID);
      cpuLRUCache.set(ID, cachedData);

      return NextResponse.json(cachedData);
    }

    // Cache miss or expired, fetch from Firestore
    const cpuData = await fetchFirestoreDocument('cpus', ID);

    if (!cpuData) {
      if (cpuLRUCache.has(ID)) {
        cpuLRUCache.delete(ID);
        cpuCacheTimestamps.delete(ID);
      }
      return NextResponse.json({ error: 'cpu not found' }, { status: 404 });
    }

    // If cache is full, evict the least recently used item
    if (cpuLRUCache.size >= CACHE_CAPACITY) {
      const leastRecentlyUsedKey = cpuLRUCache.keys().next().value;
      if (leastRecentlyUsedKey !== undefined) {
        cpuLRUCache.delete(leastRecentlyUsedKey);
        cpuCacheTimestamps.delete(leastRecentlyUsedKey);
        console.log(`🗑️ Evicted LRU cpu ID: ${leastRecentlyUsedKey}`);
      }
    }

    // Add the new cpu data to the cache
    cpuLRUCache.set(ID, cpuData);
    cpuCacheTimestamps.set(ID, currentTime);
    console.log(`🔍 Fetched and cached cpu data for ID: ${ID}`);

    return NextResponse.json(cpuData);
  } catch (error) {
    console.error("Error fetching cpu data:", error);
    return NextResponse.json({ error: 'Failed to retrieve cpu data. Please try again later.' }, { status: 500 });
  }
}