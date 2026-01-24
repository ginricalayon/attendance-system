import { NextRequest } from "next/server";
import { auth } from "@/app/lib/firebase/admin";
import { DecodedIdToken } from "firebase-admin/auth";
import { handleError } from "@/app/utils/handle-error";
import { ApiError } from "@/app/types";

export interface AuthenticatedUser {
  uid: string;
  email: string | undefined;
  emailVerified: boolean;
}

export interface AuthenticatedRequest extends NextRequest {
  user: AuthenticatedUser;
}

type RouteHandler<T = Response> = (
  request: AuthenticatedRequest,
  context?: { params: Promise<Record<string, string>> }
) => Promise<T>;

/**
 * Extracts the authentication token from the request.
 * Checks Authorization header first, then falls back to auth cookie.
 */
function extractToken(request: NextRequest): string | null {
  // First, check Authorization header
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    if (token) return token;
  }

  // Fall back to auth cookie
  const cookieToken = request.cookies.get("token")?.value;
  if (cookieToken) return cookieToken;

  return null;
}

export function requireAuth<T = Response>(handler: RouteHandler<T>) {
  return async (
    request: NextRequest,
    context?: { params: Promise<Record<string, string>> }
  ): Promise<T | Response> => {
    try {
      const token = extractToken(request);

      if (!token) {
        throw new ApiError(
          "Authentication required. Provide Authorization header or auth cookie.",
          401,
          "MISSING_AUTH"
        );
      }

      let decodedToken: DecodedIdToken;
      try {
        decodedToken = await auth.verifyIdToken(token);
      } catch (error) {
        if (error instanceof Error && error.message.includes("expired")) {
          throw new ApiError("Token has expired", 401, "TOKEN_EXPIRED");
        }
        throw new ApiError(
          "Invalid authentication token",
          401,
          "INVALID_TOKEN"
        );
      }

      const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        emailVerified: decodedToken.email_verified ?? false,
      };

      return handler(authenticatedRequest, context);
    } catch (error) {
      return handleError(error);
    }
  };
}
