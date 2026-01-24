import {
  GetStudentsQuerySchema,
  ICreateStudentRequest,
  CreateStudentRequestSchema,
} from "@/app/lib/schema/student.schema";
import {
  getStudents,
  registerStudent,
} from "@/app/lib/services/student-service";
import { NextResponse } from "next/server";
import { requireAuth, AuthenticatedRequest } from "@/app/lib/middleware/auth";
import { handleError } from "@/app/utils/handle-error";

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - student_number
 *         - last_name
 *         - first_name
 *         - department
 *         - barcode
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the student
 *         student_number:
 *           type: string
 *           description: The student's unique student number
 *         last_name:
 *           type: string
 *           description: The student's last name
 *         first_name:
 *           type: string
 *           description: The student's first name
 *         middle_initial:
 *           type: string
 *           maxLength: 1
 *           pattern: ^[A-Z]$
 *           description: The student's middle initial (optional, single uppercase letter)
 *         department:
 *           type: string
 *           enum: [CCS, COE, CBAA, COHM, SHS]
 *           description: The student's department
 *         barcode:
 *           type: string
 *           description: The student's barcode
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the student was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the student was last updated
 *     CreateStudentRequest:
 *       type: object
 *       required:
 *         - student_number
 *         - last_name
 *         - first_name
 *         - department
 *       properties:
 *         student_number:
 *           type: string
 *           description: The student's unique student number
 *         last_name:
 *           type: string
 *           description: The student's last name
 *         first_name:
 *           type: string
 *           description: The student's first name
 *         middle_initial:
 *           type: string
 *           maxLength: 1
 *           pattern: ^[A-Z]$
 *           description: The student's middle initial (optional)
 *         department:
 *           type: string
 *           enum: [CCS, COE, CBAA, COHM, SHS]
 *           description: The student's department
 *     PaginationMeta:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           description: Current page number
 *         limit:
 *           type: integer
 *           description: Number of items per page
 *         total:
 *           type: integer
 *           description: Total number of items
 *         total_pages:
 *           type: integer
 *           description: Total number of pages
 *         has_next_page:
 *           type: boolean
 *           description: Whether there is a next page
 *         has_previous_page:
 *           type: boolean
 *           description: Whether there is a previous page
 *     Error:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         error:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * /api/student:
 *   post:
 *     summary: Register a new student
 *     description: Creates a new student record in the system
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudentRequest'
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Student'
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
export const POST = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const body = await request.json();
    const validatedData: ICreateStudentRequest =
      CreateStudentRequestSchema.parse(body);
    const result = await registerStudent(validatedData);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
});

/**
 * @swagger
 * /api/student:
 *   get:
 *     summary: Get all students
 *     description: Retrieves a paginated list of students with optional filtering and sorting
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Number of items per page (max 100)
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
 *         description: Sort order
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for filtering students
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *           enum: [CCS, COE, CBAA, COHM, SHS]
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
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
 *                 pagination:
 *                   $ref: '#/components/schemas/PaginationMeta'
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
    const validatedParams = GetStudentsQuerySchema.parse(params);
    const result = await getStudents(validatedParams);

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
