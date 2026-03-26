import { z } from "zod";
import { Departments } from "./enums.schema";

export const RaffleEligibleStudentSchema = z.object({
  student_number: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  middle_initial: z.string().optional(),
  department: z.nativeEnum(Departments),
});

export const RaffleWinnerSchema = RaffleEligibleStudentSchema.extend({
  winner_id: z.string(),
  event_id: z.string(),
  won_at: z.string(),
});

export type IRaffleEligibleStudent = z.infer<typeof RaffleEligibleStudentSchema>;
export type IRaffleWinner = z.infer<typeof RaffleWinnerSchema>;
