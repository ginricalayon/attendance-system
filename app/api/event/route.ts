import { AuthenticatedRequest, requireAuth } from "@/app/lib/middleware/auth";
import {
  CreateEventRequestSchema,
  ICreateEventRequest,
} from "@/app/lib/schema/event.schema";
import { createEvent, getEvents } from "@/app/lib/services/event-service";
import { handleError } from "@/app/utils/handle-error";
import { NextResponse } from "next/server";

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the event
 *         name:
 *           type: string
 *           description: The name of the event
 *         description:
 *           type: string
 *           description: The description of the event (optional)
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the event was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the event was last updated
 *     CreateEventRequest:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the event
 *         description:
 *           type: string
 *           description: The description of the event (optional)
 *     UpdateEventRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the event
 *         description:
 *           type: string
 *           description: The description of the event (optional)
 */

/**
 * @swagger
 * /api/event:
 *   post:
 *     summary: Create a new event
 *     description: Creates a new event record in the system
 *     tags:
 *       - Events
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventRequest'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Event'
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
    const validatedData: ICreateEventRequest =
      CreateEventRequestSchema.parse(body);
    const result = await createEvent(validatedData);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
});

/**
 * @swagger
 * /api/event:
 *   get:
 *     summary: Get all events
 *     description: Retrieves a list of all events
 *     tags:
 *       - Events
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of events retrieved successfully
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
 *                     $ref: '#/components/schemas/Event'
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
export const GET = requireAuth(async (_request: AuthenticatedRequest) => {
  try {
    const result = await getEvents();
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
});
