import { auth } from "@/app/lib/firebase/admin";

export async function verifyIdToken(token: string) {
  return auth.verifyIdToken(token);
}
