import { NextRequest, NextResponse } from "next/server";
import { fetchFirestoreDocument } from "@/lib/db-services/db-utils";
import React from "react";

export async function GET(request: NextRequest, { params }: { params: { ID: string } }) {
  const { ID } =  params;
  const currentTime = Date.now();

  try {
    // Fetch the CPU document by ID
    const cpuData = await fetchFirestoreDocument('gpus', ID);

    if (!cpuData) {
      return NextResponse.json({ error: 'GPU not found' }, { status: 404 });
    }

    console.log(`🔍 Fetched GPU data for ID: ${ID}`);

    return NextResponse.json(cpuData);
  } catch (error: any) {
    console.error("Error fetching CPU data:", error.message, error.stack);
    return NextResponse.json({ error: 'Failed to retrieve CPU data. Please try again later.' }, { status: 500 });
  }
}