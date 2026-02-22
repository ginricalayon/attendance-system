import { handleError } from "@/app/utils/handle-error";
import { requireAuth, AuthenticatedRequest } from "@/app/lib/middleware/auth";
import { getAllStudents } from "@/app/lib/services/student-service";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/student/all:
 *   get:
 *     summary: Get all students without pagination
 *     description: Retrieves a full list of all students with optional filtering by search term or department. Returns all matching records without pagination. Primarily used for barcode generation.
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter students by student number, first name, or last name (exact match)
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           enum: [CCS, COE, CBAA, COHM, SHS]
 *         description: Filter students by department
 *     responses:
 *       200:
 *         description: List of all matching students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const GET = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const query = request.nextUrl.searchParams;
    const search = query.get("search") || undefined;
    const department = query.get("department") || undefined;

    const students = await getAllStudents({ search, department });

    return NextResponse.json(
      {
        success: true,
        data: students,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
});
