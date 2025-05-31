import { NextResponse } from 'next/server';

import { db } from '@/lib/firestore-db';

type GPUIndexSchema = {
  ID: string;
  Name: string;
  "Memory Size": string;
  "Memory Type": string;
  "Boost Clock": string;
  "Image URL": string;
};

let cachedGPUItems: GPUIndexSchema[] | null = null;
let cachedAt: number | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const manfParam = searchParams.get('manf');
  let pageParam = Number(searchParams.get("page")) || 1; // Default to page 1 if not provided

  const limit = 20; // Default limit for the number of items to return
  const now = Date.now(); // curent time in milliseconds

  try {
    const shouldRefetch = (!cachedAt || now - cachedAt > CACHE_TTL_MS);

    if (shouldRefetch || !cachedGPUItems) {
      const docRef = db.collection('search-index').doc('gpu-index');
      const docSnap = await docRef.get();
      const data = docSnap.data();

      cachedGPUItems = data?.Items as GPUIndexSchema[] || [];
      cachedAt = now;

      console.log("📡 Refetched GPU data from Firestore.");
    } else {
      console.log("✅ Using cached GPU data.");
    }

    let filteredItems = cachedGPUItems;//all

    if (manfParam == "nvidia")
      filteredItems = cachedGPUItems.filter(item => item.Name.toLowerCase().includes('nvidia'));//nvidia
    else if (manfParam == "amd")
      filteredItems = cachedGPUItems.filter(item => item.Name.toLowerCase().includes('amd'));//amd

    const finalData = {
      items: filteredItems.slice((pageParam - 1) * limit, pageParam * limit),
      totalPages: Math.ceil(filteredItems.length / limit), // Calculate total pages based on the limit
    }

    return NextResponse.json(finalData);//return paginated results

  } catch (error) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

}