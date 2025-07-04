import { getPCFilteredItems } from "@/lib/db-services/pc-filter";
import { NextResponse } from "next/server";
export async function POST(request: Request){
    const { searchParams } = new URL(request.url);
    const { tier , page = 1 } = await request.json();

    const cpuType = searchParams.get("cpu") || "all";
    const gpuType = searchParams.get("gpu") || "all";

    const data = await getPCFilteredItems(tier, cpuType, gpuType, page);

    return NextResponse.json(data);
}