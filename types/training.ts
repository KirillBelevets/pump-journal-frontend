export interface Set {
  reps: number;
  weight: number;
  comment?: string;
}

export interface Exercise {
  name: string;
  tempo: string;
  rest: number;
  sets: Set[];
}

export interface TrainingSession {
  _id: string;
  date: string;
  timeOfDay?: string;
  goal: string;
  dayOfWeek?: string;
  heartRate?: { start: number; end: number };
  exercises: Exercise[];
  sessionNote?: string;
}

export type TrainingSessionFormValues = Omit<TrainingSession, "_id">;
