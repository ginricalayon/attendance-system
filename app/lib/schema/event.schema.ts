import { z } from "zod";

export const EventSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  created_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export type IEvent = z.infer<typeof EventSchema>;

export const CreateEventRequestSchema = EventSchema.omit({
  created_at: true,
  updated_at: true,
});

export type ICreateEventRequest = z.infer<typeof CreateEventRequestSchema>;

export const UpdateEventRequestSchema = EventSchema.omit({
  created_at: true,
  updated_at: true,
}).partial({ name: true });

export type IUpdateEventRequest = z.infer<typeof UpdateEventRequestSchema>;
