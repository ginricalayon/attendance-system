import { handleError } from "@/app/utils/handle-error";
import { requireAuth, AuthenticatedRequest } from "@/app/lib/middleware/auth";
import {
  DeleteStudentQuerySchema,
  IUpdateStudentRequest,
  UpdateStudentQuerySchema,
  UpdateStudentRequestSchema,
  GetStudentQuerySchema,
} from "@/app/lib/schema/student.schema";
import {
  updateStudent,
  deleteStudent,
} from "@/app/lib/services/student-service";
import { NextResponse } from "next/server";
import { getStudent } from "@/app/lib/services/student-service";

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateStudentRequest:
 *       type: object
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
 *           description: The student's middle initial
 *         department:
 *           type: string
 *           enum: [CCS, COE, CBAA, COHM, SHS]
 *           description: The student's department
 */

/**
 * @swagger
 * /api/student/{id}:
 *   get:
 *     summary: Get a student by ID
 *     description: Retrieves a single student record by their ID
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student retrieved successfully
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
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Student not found
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
export const GET = requireAuth(
  async (
    _request: AuthenticatedRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const { id } = await context!.params;
      const validatedParams = GetStudentQuerySchema.parse({ student_id: id });

      const result = await getStudent(validatedParams);

      return NextResponse.json(
        { success: true, data: result },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }
);

/**
 * @swagger
 * /api/student/{id}:
 *   patch:
 *     summary: Update a student
 *     description: Updates an existing student record. All fields are optional.
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStudentRequest'
 *     responses:
 *       200:
 *         description: Student updated successfully
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
 *       404:
 *         description: Student not found
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
export const PATCH = requireAuth(
  async (
    request: AuthenticatedRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const { id } = await context!.params;
      const validatedParams = UpdateStudentQuerySchema.parse({
        student_id: id,
      });

      const body = await request.json();
      const validatedData: IUpdateStudentRequest =
        UpdateStudentRequestSchema.parse(body);

      const result = await updateStudent(
        validatedData,
        validatedParams.student_id
      );

      return NextResponse.json(
        { success: true, data: result },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }
);

/**
 * @swagger
 * /api/student/{id}:
 *   delete:
 *     summary: Delete a student
 *     description: Deletes a student record from the system
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
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
 *                       example: Student deleted successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Student not found
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
export const DELETE = requireAuth(
  async (
    _request: AuthenticatedRequest,
    context?: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const { id } = await context!.params;
      const validatedParams = DeleteStudentQuerySchema.parse({
        student_id: id,
      });

      const result = await deleteStudent(validatedParams);

      return NextResponse.json(
        { success: true, data: result },
        { status: 200 }
      );
    } catch (error) {
      return handleError(error);
    }
  }
);
