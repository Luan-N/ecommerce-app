import { NextRequest, NextResponse } from "next/server";
import {
  fetchFirestoreDocument,
  CPUIndexItem,
  GPUIndexItem,
  paginateItems,
} from "@/lib/db-services/db-utils"; // Assuming db-utils exports these types and functions

// --- Constants ---
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const ITEMS_PER_PAGE = 20;

// --- Cache State ---
let cachedProducts: ProductSchema[] | null = null;
let cacheLastUpdated: number | null = null;

async function getSearchableProducts(
  currentTime: number
): Promise<ProductSchema[]> {
  const isCacheStale =
    !cacheLastUpdated || currentTime - cacheLastUpdated > CACHE_TTL_MS;

  if (!isCacheStale && cachedProducts) {
    console.log("⚡ Serving cpu/gpu search data from cache");
    return cachedProducts;
  }

  console.log("📡 Fetching cpu/gpu search data from Firestore");

  try {
    const [cpuIndexDoc, gpuIndexDoc] = await Promise.all([
      fetchFirestoreDocument<{ Items: CPUIndexItem[] }>(
        "search-index",
        "cpu-index"
      ),
      fetchFirestoreDocument<{ Items: GPUIndexItem[] }>(
        "search-index",
        "gpu-index"
      ),
    ]);

    const cpuItemsFromDb: CPUIndexItem[] = cpuIndexDoc?.Items || [];
    const gpuItemsFromDb: GPUIndexItem[] = gpuIndexDoc?.Items || [];

    const cpuProducts: ProductSchema[] = cpuItemsFromDb.map(
      mapCPUItemToProductSchema
    );
    const gpuProducts: ProductSchema[] = gpuItemsFromDb.map(
      mapGPUItemToProductSchema
    );

    const combinedItems = [...cpuProducts, ...gpuProducts];

    // ONLY update cache if fetch was successful
    cachedProducts = combinedItems;
    cacheLastUpdated = currentTime;

    return combinedItems;
  } catch (error) {
    console.error("🚨 Failed to refresh CPU/GPU search data cache:", error);
    if (cachedProducts) {
      console.log("⚡ Returning stale CPU/GPU search data cache due to fetch error.");
      return cachedProducts;
    }
    throw error;
  }
}

// --- Main GET Handler ---
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);
  const currentTime = Date.now();

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required." },
      { status: 400 }
    );
  }

  try {
    const allProducts = await getSearchableProducts(currentTime);

    const filteredItems = allProducts.filter((item) =>
      item.Name.toLowerCase().includes(query.toLowerCase())
    );

    const { paginatedItems, totalPages } = paginateItems(
      filteredItems,
      pageParam,
      ITEMS_PER_PAGE
    );

    const responseData = {
      items: paginatedItems,
      totalPages: totalPages,
      currentPage: pageParam,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching search index:", error);
    return NextResponse.json(
      { error: "Failed to fetch search index. Please try again later." },
      { status: 500 }
    );
  }
}

// --- Types ---
type ProductSchema = {
  type: string;
  ID: string;
  Name: string;
  Description: [string, string][];
  "Image URL": string;
};
// --- Helper Functions ---
function mapCPUItemToProductSchema(item: CPUIndexItem): ProductSchema {
  const description: [string, string][] = [
    ["Cores", item.Cores.toString()],
    ["Threads", item.Threads.toString()],
    ["Boost Clock Frequency", item["Boost Clock Frequency"]],
    ["L3 Cache", item["L3 Cache"]],
  ];
  return {
    type: "cpu",
    ID: item.ID,
    Name: item.Name,
    Description: description,
    "Image URL": item["Image URL"],
  };
}

function mapGPUItemToProductSchema(item: GPUIndexItem): ProductSchema {
  const description: [string, string][] = [
    ["Memory Size", item["Memory Size"]],
    ["Memory Type", item["Memory Type"]],
    ["Boost Clock", item["Boost Clock"]],
  ];
  return {
    type: "gpu",
    ID: item.ID,
    Name: item.Name,
    Description: description,
    "Image URL": item["Image URL"],
  };
}