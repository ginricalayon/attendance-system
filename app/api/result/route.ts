import { AuthenticatedRequest, requireAuth } from "@/app/lib/middleware/auth";
import { getResults } from "@/app/lib/services/attendance-service";
import { handleError } from "@/app/utils/handle-error";
import { NextResponse } from "next/server";

/**
 * @swagger
 * components:
 *   schemas:
 *     DepartmentResult:
 *       type: object
 *       properties:
 *         department:
 *           type: string
 *           enum: [CCS, COE, CBAA, COHM, SHS]
 *           description: Department code
 *           example: "CCS"
 *         total_students:
 *           type: integer
 *           description: Total number of students in this department
 *           example: 150
 *         total_login:
 *           type: integer
 *           description: Total number of login attendance records
 *           example: 120
 *         total_logout:
 *           type: integer
 *           description: Total number of logout attendance records
 *           example: 100
 *         total_complete:
 *           type: integer
 *           description: Total number of students with both login and logout
 *           example: 95
 *         percentage:
 *           type: number
 *           format: float
 *           description: Percentage of students with complete attendance
 *           example: 63.33
 *     OverallResult:
 *       type: object
 *       properties:
 *         total_students:
 *           type: integer
 *           description: Total number of students across all departments
 *           example: 500
 *         total_login:
 *           type: integer
 *           description: Total login count across all departments
 *           example: 400
 *         total_logout:
 *           type: integer
 *           description: Total logout count across all departments
 *           example: 350
 *         total_complete:
 *           type: integer
 *           description: Total complete attendance across all departments
 *           example: 320
 *         percentage:
 *           type: number
 *           format: float
 *           description: Overall percentage of complete attendance
 *           example: 64.0
 *     ResultsResponse:
 *       type: object
 *       properties:
 *         event_id:
 *           type: string
 *           description: The ID of the current event
 *           example: "event123"
 *         event_name:
 *           type: string
 *           description: The name of the current event
 *           example: "General Assembly 2026"
 *         departments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/DepartmentResult'
 *         overall:
 *           $ref: '#/components/schemas/OverallResult'
 */

/**
 * @swagger
 * /api/result:
 *   get:
 *     summary: Get aggregated attendance results
 *     description: Retrieves aggregated attendance statistics per department for the current event configured in settings. Shows total students, login count, logout count, complete attendance count, and percentage for each department.
 *     tags:
 *       - Results
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Aggregated results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/ResultsResponse'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Settings or event not found
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
export const GET = requireAuth(async (_request: AuthenticatedRequest) => {
  try {
    const result = await getResults();
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
});
