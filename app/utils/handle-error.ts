import { ZodError } from "zod";
import { ApiError } from "../types";

export function handleError(error: unknown): Response {
  // Handle Zod validation errors
  if (error instanceof ZodError) {
    return Response.json(
      {
        success: false,
        error: {
          message: "Validation failed",
          code: "VALIDATION_ERROR",
          details: error.issues.map((err: any) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        date: Date.now(),
      },
      { status: 400 }
    );
  }

  // Handle ApiError
  if (error instanceof ApiError) {
    return Response.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
        date: Date.now(),
      },
      { status: error.statusCode }
    );
  }

  // Handle generic errors
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred";
  return Response.json(
    {
      success: false,
      error: {
        message,
        code: "INTERNAL_ERROR",
      },
      date: Date.now(),
    },
    { status: 500 }
  );
}
