import { getPCFilteredItems } from "@/lib/db-services/pc-filter";
import { NextResponse } from "next/server";
export async function POST(request: Request){
    const { searchParams } = new URL(request.url);
    const { tier , page = 1 } = await request.json();

    const cpuType = searchParams.get("cpu") || "all";
    const gpuType = searchParams.get("gpu") || "all";

    console.log("Tier:", tier, "CPU Type:", cpuType, "GPU Type:", gpuType, "Page:", page);

    const data = await getPCFilteredItems(tier);

    return NextResponse.json(data);
}