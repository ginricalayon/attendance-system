import { handleError } from "@/app/utils/handle-error";
import { ILoginRequest, LoginSchema } from "@/app/lib/schema/auth.schema";
import { login } from "@/app/lib/services/auth-service";
import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user
 *     description: Verifies a Firebase ID token and returns user information
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
 *         description: Authentication successful
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

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
