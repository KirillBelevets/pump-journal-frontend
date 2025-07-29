import { z } from "zod";

export const setSchema = z.object({
  reps: z.number().min(0, "Reps must be 0 or greater"),
  weight: z.number().min(0, "Weight must be 0 or greater"),
});

export const exerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  tempo: z.string().min(1, "Tempo is required"),
  rest: z.number().min(0, "Rest must be 0 or greater"),
  comment: z.string().optional(),
  sets: z.array(setSchema).min(1, "At least one set is required"),
});

export const trainingSessionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  dayOfWeek: z.string().min(1, "Day of week is required"),
  timeOfDay: z.string().min(1, "Time of day is required"),
  goal: z.string().min(1, "Goal is required"),
  heartRate: z.object({
    start: z.number().min(0, "Start heart rate must be 0 or greater"),
    end: z.number().min(0, "End heart rate must be 0 or greater"),
  }),
  exercises: z
    .array(exerciseSchema)
    .min(1, "At least one exercise is required"),
  sessionNote: z.string().optional(),
});
