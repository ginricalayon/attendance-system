import { NextResponse } from "next/server";
import { requireAuth, AuthenticatedRequest } from "@/app/lib/middleware/auth";
import { handleError } from "@/app/utils/handle-error";
import {
  CreateSettingsRequestSchema,
  ICreateSettingsRequest,
} from "@/app/lib/schema/settings.schema";
import {
  configureEventSettings,
  getEventSettings,
} from "@/app/lib/services/settings-service";

/**
 * @swagger
 * /api/settings:
 *   post:
 *     summary: Configure event settings
 *     description: Creates settings configuration for an event (login/logout tracking)
 *     tags:
 *       - Settings
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - event_id
 *               - type
 *             properties:
 *               event_id:
 *                 type: string
 *                 description: The ID of the event to configure
 *                 example: "abc123"
 *               type:
 *                 type: string
 *                 enum: [login, logout]
 *                 description: The type of event setting
 *                 example: "login"
 *     responses:
 *       201:
 *         description: Settings configured successfully
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
 *                     settings_id:
 *                       type: string
 *                       description: The ID of the created settings
 *                       example: "settings123"
 *                     event_id:
 *                       type: string
 *                       description: The ID of the associated event
 *                       example: "abc123"
 *                     name:
 *                       type: string
 *                       description: The name of the event
 *                       example: "Annual Conference"
 *                     description:
 *                       type: string
 *                       description: The description of the event
 *                       example: "Company annual conference 2026"
 *                     type:
 *                       type: string
 *                       enum: [login, logout]
 *                       description: The type of event setting
 *                       example: "login"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when settings were created
 *                       example: "2026-01-24T10:30:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when settings were last updated
 *                       example: "2026-01-24T10:30:00.000Z"
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
 *         description: Event not found
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
    const validatedData: ICreateSettingsRequest =
      CreateSettingsRequestSchema.parse(body);
    const result = await configureEventSettings(validatedData);

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
});

/**
 * @swagger
 * /api/settings:
 *   get:
 *     summary: Get current event settings
 *     description: Retrieves the current event settings configuration
 *     tags:
 *       - Settings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
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
 *                     settings_id:
 *                       type: string
 *                       description: The ID of the settings
 *                       example: "settings123"
 *                     event_id:
 *                       type: string
 *                       description: The ID of the associated event
 *                       example: "abc123"
 *                     name:
 *                       type: string
 *                       description: The name of the event
 *                       example: "Annual Conference"
 *                     description:
 *                       type: string
 *                       description: The description of the event
 *                       example: "Company annual conference 2026"
 *                     type:
 *                       type: string
 *                       enum: [login, logout]
 *                       description: The type of event setting
 *                       example: "login"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when settings were created
 *                       example: "2026-01-24T10:30:00.000Z"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when settings were last updated
 *                       example: "2026-01-24T10:30:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Settings or event not found
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
    const result = await getEventSettings();
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
});
