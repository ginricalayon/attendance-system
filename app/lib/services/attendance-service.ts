import { ApiError } from "@/app/types";
import { db } from "../firebase/admin";
import {
  ICreateAttendanceRequest,
  IGetAttendancesQuery,
} from "../schema/attendance.schema";
import { DBCollections, Departments, EventTypes } from "../schema/enums.schema";
import { getEventSettings } from "./settings-service";
import {
  DocumentData,
  FieldValue,
  Filter,
  Query,
} from "firebase-admin/firestore";
import logger from "../logger";

export async function createAttendance(data: ICreateAttendanceRequest) {
  try {
    const settings = await getEventSettings();

    const { settings_id, event_id, type } = settings;

    const studentRef = db
      .collection(DBCollections.STUDENTS)
      .where("student_number", "==", data.student_number);
    const studentDoc = await studentRef.get();

    if (studentDoc.docs.length === 0) {
      throw new ApiError("Student not found", 404, "STUDENT_NOT_FOUND");
    }

    const student = studentDoc.docs[0].data();

    const existingAttendance = await db
      .collection(DBCollections.ATTENDANCE)
      .where("student_number", "==", data.student_number)
      .where("settings_id", "==", settings_id)
      .where("event_id", "==", event_id)
      .where("type", "==", type)
      .get();

    if (existingAttendance.docs.length > 0) {
      throw new ApiError(
        `Student has already ${type}`,
        400,
        `STUDENT_HAS_ALREADY_${type.toUpperCase()}`
      );
    }

    const attendanceRef = db.collection(DBCollections.ATTENDANCE).doc();

    await attendanceRef.set({
      student_number: data.student_number,
      settings_id,
      event_id,
      last_name: student.last_name,
      first_name: student.first_name,
      middle_initial: student.middle_initial,
      department: student.department,
      type,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });

    return {
      attendance_id: attendanceRef.id,
      student_number: data.student_number,
      settings_id,
      event_id,
      last_name: student.last_name,
      first_name: student.first_name,
      middle_initial: student.middle_initial,
      department: student.department,
      type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Failed to create attendance", 500, "INTERNAL_ERROR");
  }
}

export async function getAttendances(params: IGetAttendancesQuery) {
  try {
    let query: Query<DocumentData> = db.collection(DBCollections.ATTENDANCE);

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

    if (params.type) {
      query = query.where("type", "==", params.type);
    }

    if (params.sort_by) {
      query = query.orderBy(params.sort_by, params.order_by);
    }

    const total = await query.count().get();
    const totalDocs = total.data().count;
    const totalPages = Math.ceil(totalDocs / params.limit);
    const hasNextPage = params.page < totalPages;
    const hasPreviousPage = params.page > 1;

    const offset = (params.page - 1) * params.limit;
    const attendances = await query.offset(offset).limit(params.limit).get();

    return {
      data: attendances.docs.map((doc) => ({
        attendance_id: doc.id,
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
    logger.error("Failed to get attendances", { error });
    throw new ApiError("Failed to get attendances", 500, "INTERNAL_ERROR");
  }
}

export async function getAllAttendances(params: IGetAttendancesQuery) {
  try {
    let query: Query<DocumentData> = db.collection(DBCollections.ATTENDANCE);

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

    if (params.type) {
      query = query.where("type", "==", params.type);
    }

    if (params.sort_by) {
      query = query.orderBy(params.sort_by, params.order_by);
    }

    const attendances = await query.get();

    return attendances.docs.map((doc) => ({
      attendance_id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at.toDate().toISOString(),
      updated_at: doc.data().updated_at.toDate().toISOString(),
    }));
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error("Failed to get all attendances", { error });
    throw new ApiError("Failed to get all attendances", 500, "INTERNAL_ERROR");
  }
}

export async function deleteAttendances() {
  try {
    const attendances = await db.collection(DBCollections.ATTENDANCE).get();

    const batch = db.batch();

    for (const attendance of attendances.docs) {
      batch.delete(attendance.ref);
    }

    await batch.commit();

    return {
      deleted_count: attendances.docs.length,
      deleted_at: new Date().toISOString(),
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error("Failed to delete attendances", { error });
    throw new ApiError("Failed to delete attendances", 500, "INTERNAL_ERROR");
  }
}

interface DepartmentResult {
  department: string;
  total_students: number;
  total_login: number;
  total_logout: number;
  total_complete: number;
  percentage: number;
}

export async function getResults() {
  try {
    const settings = await getEventSettings();
    const { event_id } = settings;

    const departments = Object.values(Departments);

    // Execute all independent queries in parallel
    const [studentCountResults, loginSnapshot, logoutSnapshot] =
      await Promise.all([
        // Fetch all student counts per department in parallel
        Promise.all(
          departments.map((department) =>
            db
              .collection(DBCollections.STUDENTS)
              .where("department", "==", department)
              .count()
              .get()
              .then((snapshot) => ({
                department,
                count: snapshot.data().count,
              }))
          )
        ),
        // Fetch all login attendance records for this event (single query)
        db
          .collection(DBCollections.ATTENDANCE)
          .where("event_id", "==", event_id)
          .where("type", "==", EventTypes.LOGIN)
          .get(),
        // Fetch all logout attendance records for this event (single query)
        db
          .collection(DBCollections.ATTENDANCE)
          .where("event_id", "==", event_id)
          .where("type", "==", EventTypes.LOGOUT)
          .get(),
      ]);

    // Create lookup map for student counts by department
    const studentCountByDepartment = new Map(
      studentCountResults.map(({ department, count }) => [department, count])
    );

    // Group login records by department using student numbers (Set for O(1) lookup)
    const loginByDepartment = new Map<string, Set<string>>();
    for (const doc of loginSnapshot.docs) {
      const { department, student_number } = doc.data();
      if (!loginByDepartment.has(department)) {
        loginByDepartment.set(department, new Set());
      }
      loginByDepartment.get(department)!.add(student_number);
    }

    // Group logout records by department
    const logoutByDepartment = new Map<string, Set<string>>();
    for (const doc of logoutSnapshot.docs) {
      const { department, student_number } = doc.data();
      if (!logoutByDepartment.has(department)) {
        logoutByDepartment.set(department, new Set());
      }
      logoutByDepartment.get(department)!.add(student_number);
    }

    // Calculate results for each department using in-memory data
    const results: DepartmentResult[] = departments.map((department) => {
      const totalStudents = studentCountByDepartment.get(department) ?? 0;
      const loginStudents = loginByDepartment.get(department) ?? new Set();
      const logoutStudents = logoutByDepartment.get(department) ?? new Set();

      const totalLogin = loginStudents.size;
      const totalLogout = logoutStudents.size;

      // Count students who have both login and logout (Set intersection)
      let totalComplete = 0;
      for (const studentNumber of logoutStudents) {
        if (loginStudents.has(studentNumber)) {
          totalComplete++;
        }
      }

      const percentage =
        totalStudents > 0
          ? Math.round((totalComplete / totalStudents) * 100 * 100) / 100
          : 0;

      return {
        department,
        total_students: totalStudents,
        total_login: totalLogin,
        total_logout: totalLogout,
        total_complete: totalComplete,
        percentage,
      };
    });

    // Calculate overall totals
    const overall = results.reduce(
      (acc, curr) => ({
        total_students: acc.total_students + curr.total_students,
        total_login: acc.total_login + curr.total_login,
        total_logout: acc.total_logout + curr.total_logout,
        total_complete: acc.total_complete + curr.total_complete,
      }),
      { total_students: 0, total_login: 0, total_logout: 0, total_complete: 0 }
    );

    const overallPercentage =
      overall.total_students > 0
        ? Math.round(
            (overall.total_complete / overall.total_students) * 100 * 100
          ) / 100
        : 0;

    return {
      event_id,
      event_name: settings.name,
      departments: results,
      overall: {
        ...overall,
        percentage: overallPercentage,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error("Failed to get results", { error });
    throw new ApiError("Failed to get results", 500, "INTERNAL_ERROR");
  }
}
