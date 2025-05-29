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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const manf = searchParams.get('manf') || 'all';
  const limit = 10; // Default limit for the number of items to return

  try {
    const docRef = db.collection('search-index').doc('cpu-index');
    const docSnap = await docRef.get();

    const items = docSnap.data()?.Items as CPUIndexItem[];

    let filteredItems = items;
    
    if(manf == "amd")
      filteredItems = items.filter(item => item.Name.toLowerCase().includes('ryzen'));
    else if (manf == "intel") 
      filteredItems = items.filter(item => item.Name.toLowerCase().includes('intel'));

    console.log(`Filtered items count: ${filteredItems.length}`);

    return NextResponse.json(filteredItems.slice(0, limit));
  } catch (error) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

}