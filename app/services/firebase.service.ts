import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  UserCredential,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  confirmPasswordReset as firebaseConfirmPasswordReset,
  verifyPasswordResetCode as firebaseVerifyPasswordResetCode,
} from "firebase/auth";
import { auth } from "@/app/lib/firebase/client";

export interface FirebaseAuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Please add Firebase configuration to environment variables."
    );
  }
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential;
  } catch (error) {
    console.error("Firebase email sign in error:", error);
    throw error;
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Please add Firebase configuration to environment variables."
    );
  }
  try {
    const provider = new GoogleAuthProvider();
    const credential = await signInWithPopup(auth, provider);
    return credential;
  } catch (error) {
    console.error("Firebase Google sign in error:", error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  if (!auth) return;
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Firebase sign out error:", error);
    throw error;
  }
}

/**
 * Get the current Firebase ID token
 */
export async function getIdToken(forceRefresh = false): Promise<string | null> {
  if (!auth) return null;
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  try {
    return await currentUser.getIdToken(forceRefresh);
  } catch (error) {
    console.error("Error getting Firebase ID token:", error);
    return null;
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string): Promise<void> {
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Please add Firebase configuration to environment variables."
    );
  }
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Firebase password reset error:", error);
    throw error;
  }
}

/**
 * Verify password reset code
 */
export async function verifyPasswordResetCode(code: string): Promise<string> {
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Please add Firebase configuration to environment variables."
    );
  }
  try {
    return await firebaseVerifyPasswordResetCode(auth, code);
  } catch (error) {
    console.error("Firebase verify reset code error:", error);
    throw error;
  }
}

/**
 * Confirm password reset with code and new password
 */
export async function confirmPasswordReset(
  code: string,
  newPassword: string
): Promise<void> {
  if (!auth) {
    throw new Error(
      "Firebase is not configured. Please add Firebase configuration to environment variables."
    );
  }
  try {
    await firebaseConfirmPasswordReset(auth, code, newPassword);
  } catch (error) {
    console.error("Firebase confirm password reset error:", error);
    throw error;
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): User | null {
  if (!auth) return null;
  return auth.currentUser;
}

/**
 * Listen to authentication state changes
 */
export function onAuthChanged(
  callback: (user: User | null) => void
): () => void {
  if (!auth) return () => {};
  return onAuthStateChanged(auth, callback);
}

/**
 * Transform Firebase User to our app's user format
 */
export function transformFirebaseUser(user: User): FirebaseAuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    emailVerified: user.emailVerified,
  };
}

// Grouped export to maintain compatibility with your original code/interceptors
export const firebaseAuthService = {
  signInWithEmail,
  signInWithGoogle,
  signOut,
  getIdToken,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
  confirmPasswordReset,
  getCurrentUser,
  onAuthChanged,
  transformFirebaseUser,
};
