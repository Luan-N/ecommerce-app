import { NextRequest, NextResponse } from "next/server";
import { fetchFirestoreDocument, CPUIndexItem, GPUIndexItem } from "@/lib/db-services/db-utils"; // Assuming db-utils exports these types and functions

// --- Types ---
type ProductSchema = {
  type: string; // 'cpu' or 'gpu'
  ID: string;
  Name: string;
  Description: [string, string][];
  "Image URL": string;
};

// --- Constants ---
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const SEARCH_RESULTS_LIMIT = 3;

// --- Cache State ---
let cachedProducts: ProductSchema[] | null = null;
let cacheLastUpdated: number | null = null;

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

async function getSearchableProducts(currentTime: number): Promise<ProductSchema[]> {
  const isCacheStale = !cacheLastUpdated || (currentTime - cacheLastUpdated > CACHE_TTL_MS);

  if (!isCacheStale && cachedProducts) {
    console.log("⚡ Serving cpu/gpu search data from cache");
    return cachedProducts;
  }

  console.log("📡 Fetching cpu/gpu search data from Firestore");

  const [cpuIndexDoc, gpuIndexDoc] = await Promise.all([
    fetchFirestoreDocument<{Items: CPUIndexItem[]}>("search-index", "cpu-index"),
    fetchFirestoreDocument<{Items: GPUIndexItem[]}>("search-index", "gpu-index")
  ]);

  const isCpuSourceInvalid = !cpuIndexDoc || cpuIndexDoc.Items === undefined;
  const isGpuSourceInvalid = !gpuIndexDoc || gpuIndexDoc.Items === undefined;

  if (isCpuSourceInvalid && isGpuSourceInvalid) 
    console.warn("🚨 Both CPU and GPU search index sources are missing or malformed.");
  
  const cpuItemsFromDb: CPUIndexItem[] = cpuIndexDoc?.Items || [];
  const gpuItemsFromDb: GPUIndexItem[] = gpuIndexDoc?.Items || [];

  const cpuProducts: ProductSchema[] = cpuItemsFromDb.map(mapCPUItemToProductSchema);
  const gpuProducts: ProductSchema[] = gpuItemsFromDb.map(mapGPUItemToProductSchema);

  const combinedItems = [...cpuProducts, ...gpuProducts];

  cachedProducts = combinedItems;
  cacheLastUpdated = currentTime;

  return combinedItems;
}

// --- Main GET Handler ---
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const currentTime = Date.now();

  if (!query) {
    return NextResponse.json([]); // Return empty array if no query
  }

  try {
    const allProducts = await getSearchableProducts(currentTime);

    const filteredItems = allProducts.filter((item) =>
      item.Name.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json(filteredItems.slice(0, SEARCH_RESULTS_LIMIT));

  } catch (error) {
    console.error("❌ Error in GET request handler for combined search:", error);
    return NextResponse.json(
      { error: "Failed to fetch search index. Please try again later." },
      { status: 500 }
    );
  }
}