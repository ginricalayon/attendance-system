/**
 * Simulate Login Script
 *
 * This script simulates a login flow by:
 * 1. Signing in with Firebase Authentication using email/password
 * 2. Getting the ID token from the authenticated user
 * 3. Calling the login API endpoint with the token
 *
 * Usage:
 *   pnpm tsx scripts/simulate-login.ts
 *
 * Environment variables required:
 *   FIREBASE_API_KEY
 *   FIREBASE_AUTH_DOMAIN
 *   FIREBASE_PROJECT_ID
 *
 * Optional CLI arguments:
 *   --email <email>     User email (or set TEST_USER_EMAIL env var)
 *   --password <pass>   User password (or set TEST_USER_PASSWORD env var)
 *   --api-url <url>     API base URL (default: http://localhost:3000)
 */

import "dotenv/config";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3000";

// Parse command line arguments
function parseArgs(): { email: string; password: string; apiUrl: string } {
  const args = process.argv.slice(2);
  let email = process.env.TEST_USER_EMAIL || "";
  let password = process.env.TEST_USER_PASSWORD || "";
  let apiUrl = API_BASE_URL;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--email":
        email = args[++i];
        break;
      case "--password":
        password = args[++i];
        break;
      case "--api-url":
        apiUrl = args[++i];
        break;
    }
  }

  if (!email || !password) {
    console.error("Error: Email and password are required.");
    console.error("\nUsage:");
    console.error(
      "  pnpm tsx scripts/simulate-login.ts --email <email> --password <password>"
    );
    console.error("\nOr set environment variables:");
    console.error("  TEST_USER_EMAIL=<email>");
    console.error("  TEST_USER_PASSWORD=<password>");
    process.exit(1);
  }

  return { email, password, apiUrl };
}

// Initialize Firebase
function initializeFirebase() {
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  // Validate required config
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error("Error: Firebase configuration is missing.");
    console.error("Required environment variables:");
    console.error("  FIREBASE_API_KEY");
    console.error("  FIREBASE_PROJECT_ID");
    process.exit(1);
  }

  const app = initializeApp(firebaseConfig);
  return getAuth(app);
}

// Sign in and get ID token
async function signInAndGetToken(
  auth: ReturnType<typeof getAuth>,
  email: string,
  password: string
): Promise<string> {
  console.log(`\n🔐 Signing in as ${email}...`);

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();

    console.log("✅ Firebase sign-in successful!");
    console.log(`   User UID: ${userCredential.user.uid}`);
    console.log(`   Email verified: ${userCredential.user.emailVerified}`);

    return idToken;
  } catch (error: unknown) {
    const firebaseError = error as { code?: string; message?: string };
    console.error("\n❌ Firebase sign-in failed:");
    console.error(`   Code: ${firebaseError.code}`);
    console.error(`   Message: ${firebaseError.message}`);
    process.exit(1);
  }
}

// Call the login API
async function callLoginApi(
  apiUrl: string,
  token: string
): Promise<{ success: boolean; data?: unknown; error?: string }> {
  const loginUrl = `${apiUrl}/api/auth/login`;
  console.log(`\n📡 Calling login API: ${loginUrl}`);

  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("\n❌ Login API failed:");
      console.error(`   Status: ${response.status}`);
      console.error(`   Response: ${JSON.stringify(data, null, 2)}`);
      return { success: false, error: data.error || "Unknown error" };
    }

    console.log("\n✅ Login API successful!");
    console.log("   Response:", JSON.stringify(data, null, 2));

    return { success: true, data };
  } catch (error: unknown) {
    const fetchError = error as Error;
    console.error("\n❌ Failed to call login API:");
    console.error(`   ${fetchError.message}`);
    return { success: false, error: fetchError.message };
  }
}

// Main function
async function main() {
  console.log("🚀 Simulate Login Script");
  console.log("========================\n");

  const { email, password, apiUrl } = parseArgs();

  // Initialize Firebase
  const auth = initializeFirebase();

  // Sign in and get token
  const idToken = await signInAndGetToken(auth, email, password);

  // Call login API
  const result = await callLoginApi(apiUrl, idToken);

  if (result.success) {
    console.log("\n" + "=".repeat(60));
    console.log("🔑 ID Token (use for authenticated requests):");
    console.log("=".repeat(60));
    console.log(idToken);
    console.log("=".repeat(60));
  }

  // Exit with appropriate code
  process.exit(result.success ? 0 : 1);
}

// Run the script
main().catch((error) => {
  console.error("\n💥 Unexpected error:", error);
  process.exit(1);
});
