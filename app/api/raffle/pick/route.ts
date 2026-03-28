import { handleError } from "@/app/utils/handle-error";
import { requireAuth, AuthenticatedRequest } from "@/app/lib/middleware/auth";
import { NextResponse } from "next/server";
import { pickWinners } from "@/app/lib/services/raffle-service";

export const POST = requireAuth(async (_request: AuthenticatedRequest) => {
  try {
    const result = await pickWinners(5);
    return NextResponse.json(
      { success: true, data: result },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
});
