import  {getAccessToken}  from '@/lib/db-services/firestore-db'; // Assuming db is already in lib

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

export type GPUIndexItem = {
  ID: string;
  Name: string;
  "Memory Size": string;
  "Memory Type": string;
  "Boost Clock": string;
  "Image URL": string;
};

// 1) Define FirestoreValue types
type FirestoreValue =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { timestampValue: string }
  | { stringValue: string }
  | { bytesValue: string }
  | { referenceValue: string }
  | { geoPointValue: { latitude: number; longitude: number } }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

// 2) Convert a single value into a JS primitive (or nested object/array)
function unwrapFirestoreValue(value: FirestoreValue): any {
  const key = Object.keys(value)[0];
  switch (key) {
    case "nullValue":
      return null;
    case "booleanValue":
      return (value as { booleanValue: boolean }).booleanValue;
    case "integerValue":
      return Number((value as { integerValue: string }).integerValue);
    case "doubleValue":
      return (value as { doubleValue: number }).doubleValue;
    case "timestampValue":
      return new Date((value as { timestampValue: string }).timestampValue);
    case "stringValue":
      return (value as { stringValue: string }).stringValue;
    case "bytesValue":
      return (value as { bytesValue: string }).bytesValue;
    case "referenceValue":
      return (value as { referenceValue: string }).referenceValue;
    case "geoPointValue":
      return { ...((value as { geoPointValue: { latitude: number; longitude: number } }).geoPointValue) };
    case "arrayValue": {
      const arr = (value as { arrayValue: { values?: FirestoreValue[] } }).arrayValue.values || [];
      return arr.map(unwrapFirestoreValue);
    }
    case "mapValue": {
      const nested = (value as { mapValue: { fields?: Record<string, FirestoreValue> } }).mapValue.fields || {};
      const obj: Record<string, any> = {};
      for (const [k, v] of Object.entries(nested)) {
        obj[k] = unwrapFirestoreValue(v);
      }
      return obj;
    }
    default:
      return null;
  }
}

// Unwrap fields 
function unwrapFirestoreFields<T>(fields: Record<string, FirestoreValue>): T {
  const output: any = {};
  for (const [key, fireVal] of Object.entries(fields)) {
    output[key] = unwrapFirestoreValue(fireVal);
  }
  return output as T;
}

export async function fetchFirestoreDocument<T>(
  collectionPath: string,
  documentPath: string
): Promise<T | null> {
  try {
    const token = await getAccessToken();
    if (!token) throw new Error("Failed to retrieve access token");

    const url = `https://firestore.googleapis.com/v1/projects/pc-linker-db/databases/(default)/documents/${collectionPath}/${documentPath}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;

    const json = await response.json();
    if (!json.fields) return null;

    return unwrapFirestoreFields<T>(json.fields);
  } catch (error) {
    console.error("Firestore fetch error:", error);
    return null;
  }
}

export function paginateItems<T>(items: T[], page: number, itemsPerPage: number): { paginatedItems: T[]; totalPages: number } {
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(items.length / itemsPerPage);
  return { paginatedItems, totalPages };
}
