import { handleError } from "@/app/utils/handle-error";
import { requireAuth, AuthenticatedRequest } from "@/app/lib/middleware/auth";
import { NextResponse } from "next/server";
import {
  CreateAttendanceRequestSchema,
  GetAttendancesQuerySchema,
  ICreateAttendanceRequest,
} from "@/app/lib/schema/attendance.schema";
import {
  createAttendance,
  deleteAttendances,
  getAttendances,
} from "@/app/lib/services/attendance-service";

/**
 * @swagger
 * components:
 *   schemas:
 *     Attendance:
 *       type: object
 *       properties:
 *         attendance_id:
 *           type: string
 *           description: The auto-generated id of the attendance record
 *           example: "att123"
 *         student_number:
 *           type: string
 *           description: The student number
 *           example: "2021-00001"
 *         settings_id:
 *           type: string
 *           description: The ID of the settings used
 *           example: "settings123"
 *         event_id:
 *           type: string
 *           description: The ID of the associated event
 *           example: "event123"
 *         last_name:
 *           type: string
 *           description: Student's last name
 *           example: "Dela Cruz"
 *         first_name:
 *           type: string
 *           description: Student's first name
 *           example: "Juan"
 *         middle_initial:
 *           type: string
 *           description: Student's middle initial (optional)
 *           example: "P"
 *         department:
 *           type: string
 *           enum: [CCS, COE, CBAA, COHM, SHS]
 *           description: Student's department
 *           example: "CCS"
 *         type:
 *           type: string
 *           enum: [login, logout]
 *           description: The type of attendance (login or logout)
 *           example: "login"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when attendance was recorded
 *           example: "2026-01-24T10:30:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when attendance was last updated
 *           example: "2026-01-24T10:30:00.000Z"
 *     CreateAttendanceRequest:
 *       type: object
 *       required:
 *         - student_number
 *       properties:
 *         student_number:
 *           type: string
 *           description: The student number to record attendance for
 *           example: "2021-00001"
 */

/**
 * @swagger
 * /api/attendance:
 *   post:
 *     summary: Record student attendance
 *     description: Records attendance for a student based on the current event settings. Automatically retrieves student information and applies the current login/logout type from settings.
 *     tags:
 *       - Attendance
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttendanceRequest'
 *     responses:
 *       201:
 *         description: Attendance recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Student or event settings not found
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
export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();
    const validatedData: ICreateAttendanceRequest =
      CreateAttendanceRequestSchema.parse(body);

    const result = await createAttendance(validatedData);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
});

/**
 * @swagger
 * /api/attendance:
 *   get:
 *     summary: Get attendance records
 *     description: Retrieves a paginated list of attendance records with optional filtering and sorting
 *     tags:
 *       - Attendance
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of records per page
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: order_by
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by student number, first name, or last name
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           enum: [CCS, COE, CBAA, COHM, SHS]
 *         description: Filter by department
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [login, logout]
 *         description: Filter by attendance type
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
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
 *                     $ref: '#/components/schemas/Attendance'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     total:
 *                       type: integer
 *                       example: 100
 *                     total_pages:
 *                       type: integer
 *                       example: 5
 *                     has_next_page:
 *                       type: boolean
 *                       example: true
 *                     has_previous_page:
 *                       type: boolean
 *                       example: false
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
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
    const params = Object.fromEntries(query.entries());
    const validatedParams = GetAttendancesQuerySchema.parse(params);
    const result = await getAttendances(validatedParams);

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        pagination: {
          page: validatedParams.page,
          limit: validatedParams.limit,
          total: result.total,
          total_pages: result.total_pages,
          has_next_page: result.has_next_page,
          has_previous_page: result.has_previous_page,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error);
  }
});

/**
 * @swagger
 * /api/attendance:
 *   delete:
 *     summary: Delete all attendance records
 *     description: Deletes all attendance records from the system. This action is irreversible.
 *     tags:
 *       - Attendance
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All attendance records deleted successfully
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
 *                     message:
 *                       type: string
 *                       example: "All attendance records deleted successfully"
 *                     deleted_count:
 *                       type: integer
 *                       example: 42
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
export const DELETE = requireAuth(async (_request: AuthenticatedRequest) => {
  try {
    const result = await deleteAttendances();
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
});
