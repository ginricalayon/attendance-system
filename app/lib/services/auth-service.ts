import { verifyIdToken } from "@/app/lib/services/firebase-auth-service";
import { ApiError } from "@/app/types";
import { ILoginRequest } from "../schema/auth.schema";

export interface LoginResult {
  uid: string;
  email: string | undefined;
  emailVerified: boolean;
}

export async function login(request: ILoginRequest): Promise<LoginResult> {
  try {
    const decodedToken = await verifyIdToken(request.token);

    return {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified ?? false,
    };
  } catch (error) {
    if (error instanceof Error && error.message.includes("expired")) {
      throw new ApiError("Token has expired", 401, "TOKEN_EXPIRED");
    }
    throw new ApiError("Invalid authentication token", 401, "INVALID_TOKEN");
  }
}
