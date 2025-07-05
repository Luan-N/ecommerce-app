import { fetchFirestoreDocument } from "./firestore-db";

export async function getPCInfo(ID: string){
    console.log(`🔍 Fetching PC info for ID: ${ID}`);
  try {
    const pcData = await fetchFirestoreDocument('pc-combinations', ID);
    if (!pcData) {
      throw new Error(`PC with ID ${ID} not found`);
    }
    return pcData;
  } catch (error) {
    console.error(`Error fetching PC info for ID ${ID}:`, error);
    throw error;
  }
}