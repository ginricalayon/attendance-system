import { ApiError } from "@/app/types";
import { db } from "../firebase/admin";
import {
  ICreateAttendanceRequest,
  IGetAttendancesQuery,
} from "../schema/attendance.schema";
import { DBCollections } from "../schema/enums.schema";
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

    const attendances = await query.get();

    const total = await query.count().get();
    const totalDocs = total.data().count;
    const totalPages = Math.ceil(totalDocs / params.limit);
    const hasNextPage = params.page < totalPages;
    const hasPreviousPage = params.page > 1;

    return {
      data: attendances.docs.map((doc) => ({
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
