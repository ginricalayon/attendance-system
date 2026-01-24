import { AuthenticatedRequest, requireAuth } from "@/app/lib/middleware/auth";
import { importStudentsFromCSV } from "@/app/lib/services/student-service";
import { handleError } from "@/app/utils/handle-error";
import { NextResponse } from "next/server";

/**
 * @swagger
 * components:
 *   schemas:
 *     ImportResult:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Import completed
 *         total_rows:
 *           type: integer
 *           description: Total number of data rows in the CSV (excluding header)
 *         successful:
 *           type: integer
 *           description: Number of students successfully imported
 *         failed:
 *           type: integer
 *           description: Number of rows that failed (validation + import errors)
 *         validation_errors:
 *           type: array
 *           description: Rows that failed schema validation
 *           items:
 *             type: object
 *             properties:
 *               row:
 *                 type: integer
 *                 description: Row number in CSV file
 *               errors:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                     message:
 *                       type: string
 *                     path:
 *                       type: array
 *                       items:
 *                         type: string
 *         import_errors:
 *           type: array
 *           description: Rows that passed validation but failed during import
 *           items:
 *             type: object
 *             properties:
 *               row:
 *                 type: integer
 *                 description: Row number in CSV file
 *               student_number:
 *                 type: string
 *                 description: The student number that failed
 *               error:
 *                 type: string
 *                 description: Error message
 *         created_students:
 *           type: array
 *           description: Successfully created students
 *           items:
 *             type: object
 *             properties:
 *               row:
 *                 type: integer
 *                 description: Row number in CSV file
 *               student_id:
 *                 type: string
 *                 description: The generated student ID
 *               student_number:
 *                 type: string
 *                 description: The student number
 */

/**
 * @swagger
 * /api/student/import:
 *   post:
 *     summary: Import students from CSV file
 *     description: |
 *       Bulk import students from a CSV file. The CSV must have a header row and contain the following columns in order:
 *       1. student_number
 *       2. last_name
 *       3. first_name
 *       4. middle_initial (optional, can be empty)
 *       5. department (CCS, COE, CBAA, COHM, or SHS)
 *
 *       Barcodes are automatically generated for each student based on their student number.
 *     tags:
 *       - Students
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV file containing student data
 *     responses:
 *       200:
 *         description: Import completed (may include partial failures)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImportResult'
 *       400:
 *         description: Bad request - No file provided, invalid file type, or empty CSV
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No file provided
 *                 code:
 *                   type: string
 *                   enum: [FILE_REQUIRED, INVALID_FILE_TYPE, EMPTY_CSV, NO_VALID_ROWS]
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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided", code: "FILE_REQUIRED" },
        { status: 400 }
      );
    }

    const result = await importStudentsFromCSV(file);

    return NextResponse.json({
      message: "Import completed",
      ...result,
    });
  } catch (error) {
    return handleError(error);
  }
});
