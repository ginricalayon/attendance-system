import { AuthenticatedRequest, requireAuth } from "@/app/lib/middleware/auth";
import { handleError } from "@/app/utils/handle-error";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/auth/session:
 *   get:
 *     summary: Retrieve user session
 *     description: Retrieves the currently authenticated user's data from their session
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: User session retrieved successfully
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
 *                     email:
 *                       type: string
 *                     emailVerified:
 *                       type: boolean
 *       401:
 *         description: Authentication failed - invalid or missing token
 */
export const GET = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    return NextResponse.json(
      { success: true, data: request.user },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
});
