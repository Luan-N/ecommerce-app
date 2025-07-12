// lib/db-services/info-utils.ts

import { unstable_cache } from 'next/cache';
import { fetchFirestoreDocument } from "@/lib/db-services/firestore-db";

const CACHE_TTL_SECONDS = 15 * 60;

export async function getItemInfo<T>(ID: string, type: string ): Promise<T> {
  const getCachedItemData = unstable_cache(
    async () => (
       await fetchFirestoreDocument(type, ID)
  ),
    [`${type}-item-data-${ID}`],
    {
      revalidate: CACHE_TTL_SECONDS,
      tags: [`${type}-items`, `item-${ID}`],
    }
  );

  try {
    console.log(`🔍 Fetching ${type} data for ID: ${ID}`);
    return await getCachedItemData() as T;
  } catch (error) {
    console.error(`❌ Error in getItemInfo for ${type} data:`, error);
    throw error;
  }
}