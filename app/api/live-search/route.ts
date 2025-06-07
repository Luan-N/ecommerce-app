import { NextRequest, NextResponse } from "next/server";
import { getSearchableProducts } from "@/lib/db-services/search-utils";
import { ApiError } from "next/dist/server/api-utils";

// --- Types ---
type ProductSchema = {
  type: string; // 'cpu' or 'gpu'
  ID: string;
  Name: string;
  Description: [string, string][];
  "Image URL": string;
};

// --- Constants ---
const SEARCH_RESULTS_LIMIT = 3;

// --- Main GET Handler ---
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const currentTime = Date.now();

  if (!query) {
    throw new ApiError(400, "Query parameter is required");
  }

  const allProducts = await getSearchableProducts(currentTime);

  const filteredItems = allProducts.filter((item) =>
    item.Name.toLowerCase().includes(query.toLowerCase())
  );

  return NextResponse.json(filteredItems.slice(0, SEARCH_RESULTS_LIMIT));

}