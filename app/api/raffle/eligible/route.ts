import { handleError } from "@/app/utils/handle-error";
import { requireAuth, AuthenticatedRequest } from "@/app/lib/middleware/auth";
import { NextResponse } from "next/server";
import { getEligibleStudents } from "@/app/lib/services/raffle-service";

export const GET = requireAuth(async (_request: AuthenticatedRequest) => {
  try {
    const result = await getEligibleStudents();
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
});
