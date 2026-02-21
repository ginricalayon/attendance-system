import { ApiError } from "@/app/types";
import {
  IGetStudentsQuery,
  IUpdateStudentRequest,
  IDeleteStudentQuery,
  IGetStudentQuery,
  ICreateStudentRequest,
} from "../schema/student.schema";
import { db } from "../firebase/admin";
import { DBCollections } from "../schema/enums.schema";
import {
  DocumentData,
  FieldValue,
  Filter,
  Query,
} from "firebase-admin/firestore";
import { CSVRow } from "../schema/csv.schema";
import { CSVRowSchema } from "../schema/csv.schema";
import { ZodIssue } from "zod";
import { generateBarcodeBase64 } from "@/app/utils/generate-barcode";

export async function registerStudent(request: ICreateStudentRequest) {
  try {
    const existingStudent = await db
      .collection(DBCollections.STUDENTS)
      .where("student_number", "==", request.student_number)
      .get();

    if (existingStudent.docs.length > 0) {
      throw new ApiError(
        "Student number already exists",
        400,
        "STUDENT_NUMBER_ALREADY_EXISTS"
      );
    }

    const barcode = await generateBarcodeBase64(request.student_number);
    const studentRef = db.collection(DBCollections.STUDENTS).doc();

    await studentRef.set({
      student_number: request.student_number,
      last_name: request.last_name,
      first_name: request.first_name,
      middle_initial: request.middle_initial,
      department: request.department,
      barcode: barcode,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    return {
      student_id: studentRef.id,
      student_number: request.student_number,
      last_name: request.last_name,
      first_name: request.first_name,
      middle_initial: request.middle_initial,
      department: request.department,
      barcode: barcode,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}

export async function getStudents(params: IGetStudentsQuery) {
  try {
    let query: Query<DocumentData> = db.collection(DBCollections.STUDENTS);

    if (params.search) {
      query = query.where(
        Filter.or(
          Filter.where("student_number", "==", params.search),
          Filter.where("last_name", "==", params.search),
          Filter.where("first_name", "==", params.search)
        )
      );
    }

    if (params.department) {
      query = query.where("department", "==", params.department);
    }

    if (params.sort_by) {
      query = query.orderBy(params.sort_by, params.order_by);
    }

    const students = await query.get();

    const total = await query.count().get();
    const totalDocs = total.data().count;
    const totalPages = Math.ceil(totalDocs / params.limit);
    const hasNextPage = params.page < totalPages;
    const hasPreviousPage = params.page > 1;

    return {
      data: students.docs.map((doc) => ({
        student_id: doc.id,
        ...doc.data(),
        created_at: doc.data().created_at.toDate().toISOString(),
        updated_at: doc.data().updated_at.toDate().toISOString(),
      })),
      total: totalDocs,
      total_pages: totalPages,
      has_next_page: hasNextPage,
      has_previous_page: hasPreviousPage,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : "An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}

export async function updateStudent(
  request: IUpdateStudentRequest,
  id: string
) {
  try {
    const studentRef = db.collection(DBCollections.STUDENTS).doc(id);

    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      throw new ApiError("Student not found", 404, "STUDENT_NOT_FOUND");
    }

    const studentData = studentDoc.data();

    if (
      request.student_number !== undefined &&
      studentData?.student_number !== request.student_number
    ) {
      const existingStudent = await db
        .collection(DBCollections.STUDENTS)
        .where("student_number", "==", request.student_number)
        .get();

      if (existingStudent.docs.length > 0) {
        throw new ApiError(
          "Student number already exists",
          400,
          "STUDENT_NUMBER_ALREADY_EXISTS"
        );
      }
    }

    const updateData: Record<string, unknown> = {
      updated_at: FieldValue.serverTimestamp(),
    };

    if (request.student_number !== undefined) {
      updateData.student_number = request.student_number;
    }

    if (request.last_name !== undefined) {
      updateData.last_name = request.last_name;
    }

    if (request.first_name !== undefined) {
      updateData.first_name = request.first_name;
    }

    if (request.middle_initial !== undefined) {
      updateData.middle_initial = request.middle_initial;
    }

    if (request.department !== undefined) {
      updateData.department = request.department;
    }

    await studentRef.update(updateData);

    const updatedDoc = await studentRef.get();
    const updatedData = updatedDoc.data();

    return {
      student_id: id,
      student_number: updatedData?.student_number,
      last_name: updatedData?.last_name,
      first_name: updatedData?.first_name,
      middle_initial: updatedData?.middle_initial,
      department: updatedData?.department,
      created_at: updatedData?.created_at.toDate().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}

export async function deleteStudent(request: IDeleteStudentQuery) {
  try {
    const studentRef = db
      .collection(DBCollections.STUDENTS)
      .doc(request.student_id);

    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      throw new ApiError("Student not found", 404, "STUDENT_NOT_FOUND");
    }

    await studentRef.delete();

    return { student_id: request.student_id };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}

export async function getStudent(params: IGetStudentQuery) {
  try {
    const studentRef = db
      .collection(DBCollections.STUDENTS)
      .doc(params.student_id);

    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      throw new ApiError("Student not found", 404, "STUDENT_NOT_FOUND");
    }

    const studentData = studentDoc.data();

    return {
      student_id: params.student_id,
      student_number: studentData?.student_number,
      last_name: studentData?.last_name,
      first_name: studentData?.first_name,
      middle_initial: studentData?.middle_initial,
      department: studentData?.department,
      barcode: studentData?.barcode,
      created_at: studentData?.created_at.toDate().toISOString(),
      updated_at: studentData?.updated_at.toDate().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("An unexpected error occurred", 500, "INTERNAL_ERROR");
  }
}

function parseCSV(csvContent: string): string[][] {
  const lines = csvContent.split(/\r?\n/).filter((line) => line.trim() !== "");
  return lines.map((line) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  });
}

export async function importStudentsFromCSV(file: File) {
  if (!file.name.endsWith(".csv")) {
    throw new ApiError("File must be a CSV file", 400, "INVALID_FILE_TYPE");
  }

  const csvContent = await file.text();
  const rows = parseCSV(csvContent);

  if (rows.length < 2) {
    throw new ApiError(
      "CSV file must contain a header row and at least one data row",
      400,
      "EMPTY_CSV"
    );
  }

  // Skip header row (first row)
  const dataRows = rows.slice(1);

  const validatedRows: { row: number; data: CSVRow }[] = [];
  const validationErrors: { row: number; errors: ZodIssue[] }[] = [];
  let processedRowCount = 0;

  // Validate each row
  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const rowNumber = i + 2; // +2 because: +1 for 0-index, +1 for skipped header

    // Skip rows where all values are empty (handles trailing empty rows in CSV)
    const isEmptyRow = row.every((value) => value.trim() === "");
    if (isEmptyRow) {
      continue;
    }

    processedRowCount++;

    if (row.length < 5) {
      validationErrors.push({
        row: rowNumber,
        errors: [
          {
            code: "custom",
            message: `Expected 5 columns but got ${row.length}`,
            path: ["row", rowNumber, "column", i + 1],
          },
        ],
      });
      continue;
    }

    const rowData = {
      student_number: row[0],
      last_name: row[1],
      first_name: row[2],
      middle_initial: row[3] || "",
      department: row[4],
    };

    const result = CSVRowSchema.safeParse(rowData);

    if (result.success) {
      validatedRows.push({ row: rowNumber, data: result.data });
    } else {
      validationErrors.push({
        row: rowNumber,
        errors: result.error.issues,
      });
    }
  }

  if (validatedRows.length === 0) {
    throw new ApiError("No valid rows found in CSV", 400, "NO_VALID_ROWS");
  }

  // Get all existing student numbers in a single query for efficiency
  const existingStudentsSnapshot = await db
    .collection(DBCollections.STUDENTS)
    .select("student_number")
    .get();

  const existingStudentNumbers = new Set(
    existingStudentsSnapshot.docs.map((doc) => doc.data().student_number)
  );

  // Track student numbers being imported to detect duplicates within the CSV
  const importingStudentNumbers = new Set<string>();

  const createdStudents: {
    row: number;
    student_id: string;
    student_number: string;
  }[] = [];
  const importErrors: { row: number; student_number: string; error: string }[] =
    [];

  for (const { row: rowNumber, data } of validatedRows) {
    try {
      // Check for duplicate within the CSV file
      if (importingStudentNumbers.has(data.student_number)) {
        importErrors.push({
          row: rowNumber,
          student_number: data.student_number,
          error: "Duplicate student number within CSV file",
        });
        continue;
      }

      // Check if student number already exists in database
      if (existingStudentNumbers.has(data.student_number)) {
        importErrors.push({
          row: rowNumber,
          student_number: data.student_number,
          error: "Student number already exists in database",
        });
        continue;
      }

      // Generate barcode as base64 from student number
      const barcode = await generateBarcodeBase64(data.student_number);

      const studentRef = db.collection(DBCollections.STUDENTS).doc();

      await studentRef.set({
        student_number: data.student_number,
        last_name: data.last_name,
        first_name: data.first_name,
        middle_initial: data.middle_initial || "",
        department: data.department,
        barcode: barcode,
        created_at: FieldValue.serverTimestamp(),
        updated_at: FieldValue.serverTimestamp(),
      });

      importingStudentNumbers.add(data.student_number);
      existingStudentNumbers.add(data.student_number);

      createdStudents.push({
        row: rowNumber,
        student_id: studentRef.id,
        student_number: data.student_number,
      });
    } catch (error) {
      importErrors.push({
        row: rowNumber,
        student_number: data.student_number,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return {
    total_rows: dataRows.length,
    successful: createdStudents.length,
    failed: importErrors.length + validationErrors.length,
    validation_errors: validationErrors,
    import_errors: importErrors,
    created_students: createdStudents,
  };
}
