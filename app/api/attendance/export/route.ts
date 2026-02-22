import { handleError } from "@/app/utils/handle-error";
import { requireAuth, AuthenticatedRequest } from "@/app/lib/middleware/auth";
import {
  GetAttendancesQuerySchema,
} from "@/app/lib/schema/attendance.schema";
import { getAllAttendances } from "@/app/lib/services/attendance-service";
import { NextResponse } from "next/server";

export const GET = requireAuth(async (request: AuthenticatedRequest) => {
  try {
    const query = request.nextUrl.searchParams;
    const params = Object.fromEntries(query.entries());
    
    // We parse the query params but we don't need a limit anymore
    const validatedParams = GetAttendancesQuerySchema.parse({
      ...params,
      limit: 1, // Doesn't matter, getAllAttendances ignores it
    });
    
    // Get all records matching the search/filter criteria directly (no pagination)
    const records = await getAllAttendances(validatedParams);
    
    // Convert to CSV
    const rows = records.map((record: any) => {
      return [
        record.student_number,
        record.last_name,
        record.first_name,
        record.middle_initial || "",
        record.department,
        record.type,
        new Date(record.created_at).toLocaleString()
      ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(",");
    });
    
    const header = "Student Number,Last Name,First Name,Middle Initial,Department,Type,Timestamp";
    const csvContent = [header, ...rows].join("\n");
    
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="attendance_export_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    return handleError(error);
  }
});
