import { NextResponse } from 'next/server';

import { db } from '@/lib/firestore-db';

type CPUIndexItem = {
  ID: string;
  Name: string;
  Cores: number;
  Threads: number;
  'Boost Clock Frequency': string;
  'L3 Cache': string;
  "Image URL": string;
};

let cachedCPUItems: CPUIndexItem[] | null = null;
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

    if (shouldRefetch || !cachedCPUItems) {
      const docRef = db.collection('search-index').doc('cpu-index');
      const docSnap = await docRef.get();
      const data = docSnap.data();

      cachedCPUItems = data?.Items as CPUIndexItem[] || [];
      cachedAt = now;

      console.log("📡 Refetched CPU data from Firestore.");
    } else {
      console.log("✅ Using cached CPU data.");
    }

    let filteredItems = cachedCPUItems;//all

    if (manfParam == "amd")
      filteredItems = cachedCPUItems.filter(item => item.Name.toLowerCase().includes('ryzen'));//amd/ryzen
    else if (manfParam == "intel")
      filteredItems = cachedCPUItems.filter(item => item.Name.toLowerCase().includes('intel'));//intel

    const finalData = {
      items: filteredItems.slice((pageParam - 1) * limit, pageParam * limit),
      totalPages: Math.ceil(filteredItems.length / limit), // Calculate total pages based on the limit
    }

    return NextResponse.json(finalData);//return paginated results

  } catch (error) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

}

