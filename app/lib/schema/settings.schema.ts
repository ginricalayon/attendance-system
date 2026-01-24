import { z } from "zod";
import { EventTypes } from "./enums.schema";

export const SettingsSchema = z.object({
  event_id: z.string().min(1, { message: "Event ID is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  type: z.nativeEnum(EventTypes),
  created_at: z.date(),
  updated_at: z.date(),
});

export type ISettings = z.infer<typeof SettingsSchema>;

export const CreateSettingsRequestSchema = SettingsSchema.omit({
  created_at: true,
  updated_at: true,
  name: true,
  description: true,
});

export type ICreateSettingsRequest = z.infer<
  typeof CreateSettingsRequestSchema
>;
