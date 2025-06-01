import { db } from '@/lib/db-services/firestore-db'; // Assuming db is already in lib

// --- Types ---
export type CPUIndexItem = {
  ID: string;
  Name: string;
  Cores: number;
  Threads: number;
  'Boost Clock Frequency': string;
  'L3 Cache': string;
  "Image URL": string;
};

export function paginateItems<T>(items: T[], page: number, itemsPerPage: number): { paginatedItems: T[]; totalPages: number } {
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  return { paginatedItems, totalPages };
}

export async function fetchFirestoreDocument<T>(
  collectionPath: string,
  documentPath: string
): Promise<T | null> {
  try {
    console.log(`🔥 Firestore Direct Fetch: Document '${documentPath}' from collection '${collectionPath}'.`);
    const docRef = db.collection(collectionPath).doc(documentPath);
    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return docSnap.data() as T;
    } else {
      console.log(` Firestore: Document '${documentPath}' not found in collection '${collectionPath}'.`);
      return null;
    }
  } catch (error) {
    console.error(` Firestore Error: Failed to fetch document '${documentPath}' from '${collectionPath}':`, error);
    throw error; // Re-throw the original Firestore error
  }
}