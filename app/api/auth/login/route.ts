import { handleError } from "@/app/utils/handle-error";
import { ILoginRequest, LoginSchema } from "@/app/lib/schema/auth.schema";
import { login } from "@/app/lib/services/auth-service";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Verifies a Firebase ID token, sets an HTTP-only auth cookie, and returns user information
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 description: Firebase ID token from client authentication
 *     responses:
 *       200:
 *         description: Authentication successful. Sets token cookie.
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only authentication cookie
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       description: User's unique identifier
 *                     email:
 *                       type: string
 *                       description: User's email address
 *                     emailVerified:
 *                       type: boolean
 *                       description: Whether email is verified
 *       400:
 *         description: Validation error - token is missing or invalid format
 *       401:
 *         description: Authentication failed - invalid or expired token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData: ILoginRequest = LoginSchema.parse(body);

    const result = await login(validatedData);

    const response = NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: validatedData.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: validatedData.remember_me ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    return handleError(error);
  }
}
