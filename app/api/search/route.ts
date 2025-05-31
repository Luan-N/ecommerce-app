import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firestore-db";

type ProductSchema = {
  ID: string;
  Name: string;
  Description: [string, string][];
  "Image URL": string;
};

type CPUIndexItem = {
  ID: string;
  Name: string;
  Cores: number;
  Threads: number;
  "Boost Clock Frequency": string;
  "L3 Cache": string;
  "Image URL": string;
};

type GPUIndexItem = {
  ID: string;
  Name: string;
  "Memory Size": string;
  "Memory Type": string;
  "Boost Clock": string;
  "Image URL": string;
};

let cached: ProductSchema[] | null = null;
let cachedAt: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const limit = 3;
  const now = Date.now();

  if (!query) {
    return NextResponse.json([]);
  }

  const shouldRefetch = !cachedAt || now - cachedAt > CACHE_TTL_MS;

  try {
    if (!shouldRefetch && cached) {
      console.log("⚡ Serving from cache");
      const filtered = cached.filter((item) =>
        item.Name.toLowerCase().includes(query.toLowerCase())
      );
      return NextResponse.json(filtered.slice(0, limit));
    }

    console.log("📡 Fetching new data from Firestore");

    const cpuDocRef = db.collection("search-index").doc("cpu-index");
    const gpuDocRef = db.collection("search-index").doc("gpu-index");

    const [cpuDocSnap, gpuDocSnap] = await Promise.all([
      cpuDocRef.get(),
      gpuDocRef.get(),
    ]);

    const cpuData = cpuDocSnap.data();
    const gpuData = gpuDocSnap.data();

    if ((!cpuData || !cpuData.Items) && (!gpuData || !gpuData.Items)) {
      return NextResponse.json(
        { error: "No search index found" },
        { status: 404 }
      );
    }

    const cpuItems: ProductSchema[] = (cpuData?.Items || []).map(mapCPUItemToProductSchema);
    const gpuItems: ProductSchema[] = (gpuData?.Items || []).map(mapGPUItemToProductSchema);

    const combinedItems = [...cpuItems, ...gpuItems];

    // ✅ Store in cache
    cached = combinedItems;
    cachedAt = now;

    const filteredItems = combinedItems.filter((item) =>
      item.Name.toLowerCase().includes(query.toLowerCase())
    );

    return NextResponse.json(filteredItems.slice(0, limit));
  } catch (error) {
    console.error("Error fetching search index:", error);
    return NextResponse.json(
      { error: "Failed to fetch search index" },
      { status: 500 }
    );
  }
}


function mapCPUItemToProductSchema(item: CPUIndexItem): ProductSchema {

  const Description: [string, string][] = [
    ["Cores", item.Cores.toString()],
    ["Threads", item.Threads.toString()],
    ["Boost Clock Frequency", item["Boost Clock Frequency"]],
    ["L3 Cache", item["L3 Cache"]],
  ];

  return {
    ID: item.ID,
    Name: item.Name,
    Description: Description,
    "Image URL": item["Image URL"],
  };
}

function mapGPUItemToProductSchema(item: GPUIndexItem): ProductSchema {
  const Description: [string, string][] = [
    ["Memory Size", item["Memory Size"]],
    ["Memory Type", item["Memory Type"]],
    ["Boost Clock", item["Boost Clock"]],
  ];

  return {
    ID: item.ID,
    Name: item.Name,
    Description: Description,
    "Image URL": item["Image URL"],
  };
}

