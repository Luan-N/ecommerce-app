import { getTokenFromGCPServiceAccount } from '@sagi.io/workers-jwt'
import { ApiError } from './errors';

// --- Cached Token ---
let CachedToken: string | null = null;
let CachedTokenExpiry: number = 0;
const TokenRefreshedBuffer = 5 * 60; // 5 minutes in seconds`
// --- Utility Functions ---
export async function getNewToken() {
  const jwtToken = await getTokenFromGCPServiceAccount({
    serviceAccountJSON: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!),
    aud: 'https://oauth2.googleapis.com/token',
    payloadAdditions: {
      scope: [
        // scope required for firestore
        'https://www.googleapis.com/auth/datastore',
      ].join(' '),
    },
  })

  return await (
    await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwtToken, // the JWT token generated in the previous step
      }),
    })
  ).json();
}

export async function getAccessToken(): Promise<string | null> {
  const now = Date.now() / 1000; // Current time in seconds

  //Fetch in-memeory cached token
  if(CachedToken && (now + TokenRefreshedBuffer) < CachedTokenExpiry) {
    console.log("Using cached token");
    return CachedToken;
  }

  //Fetch new token from Cloudfare KV and update in-memory cache
  // const kvToken = await MY_KV.get("access_token", { type: "json" });
  // if(kvToken && (now + TokenRefreshedBuffer) < kvToken.expiry) {
  //   console.log("Using KV cached token");
  //   CachedToken = kvToken.token;
  //   CachedTokenExpiry = kvToken.expiry;
  //   return CachedToken;
  // }

  //Fetch a new token and update both in-memory cache and Cloudflare KV
  const token = await getNewToken();
  if (token) {
    CachedToken = token.access_token;
    CachedTokenExpiry = now + token.expires_in
    console.log("Fetched new token from GCP Service Account");
    // await MY_KV.put("access_token", JSON.stringify({
    //   token: CachedToken,
    //   expiry: CachedTokenExpiry
    // }), {
    //   expirationTtl: token.expires_in
    // });
    return CachedToken;
  }

  return null;
}

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
function unwrapFirestoreValue(value: FirestoreValue): unknown {
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
      const obj: Record<string, unknown> = {};
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
  const output: Record<string, unknown> = {};
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
    if (!token) throw new ApiError("Failed to retrieve access token for Firestore", 500);

    const url = `https://firestore.googleapis.com/v1/projects/pc-linker-db/databases/(default)/documents/${collectionPath}/${documentPath}`;
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new ApiError(`Failed to fetch document: ${response.statusText}`, response.status);

    const json = await response.json();
    if (!json.fields) throw new ApiError("Document fields are empty or not found", 500);

    return unwrapFirestoreFields<T>(json.fields);
  } catch (error) {
    console.error("Firestore fetch error:", error);
    throw error;
  }
}