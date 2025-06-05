import { getTokenFromGCPServiceAccount } from '@sagi.io/workers-jwt'

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
        // The following scopes are required only for realtime database
        // 'https://www.googleapis.com/auth/userinfo.email',
        // 'https://www.googleapis.com/auth/firebase.database',
      ].join(' '),
    },
  })

  const resp = await (
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
  )

  if (!resp.ok) {
    console.error('Failed to fetch access token from GCP Service Account:', resp.statusText);
    throw new Error('Failed to fetch access token');
  }

  return await resp.json();
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