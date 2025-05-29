"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ExerciseInput, { Exercise } from "./ExerciseInput";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TrainingSessionForm() {
  const { token } = useAuth();
  const router = useRouter();

  const [goal, setGoal] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [heartRateStart, setHeartRateStart] = useState("");
  const [heartRateEnd, setHeartRateEnd] = useState("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [sessionNote, setSessionNote] = useState("");
  const [error, setError] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      const dayIdx = date.getDay();
      setDayOfWeek(daysOfWeek[dayIdx]);
    } else {
      setDayOfWeek("");
    }
  };

  const addExercise = () => {
    setExercises((prev) => [
      ...prev,
      { name: "", tempo: "", rest: 0, sets: [] },
    ]);
  };

  const updateExercise = (index: number, updated: Exercise) => {
    setExercises((prev) => prev.map((ex, i) => (i === index ? updated : ex)));
  };

  const removeExercise = (index: number) => {
    setExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) return setError("Not authenticated");
    try {
      const res = await fetch("http://localhost:3000/trainings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: date ? date.toISOString().slice(0, 10) : "",
          dayOfWeek,
          timeOfDay,
          goal,
          heartRate: {
            start: Number(heartRateStart),
            end: Number(heartRateEnd),
          },
          exercises,
          sessionNote,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit session");
      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Unknown error");
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto my-6 bg-gradient-to-br from-teal-50 via-white to-yellow-50 rounded-2xl shadow-lg border border-teal-100 p-4 sm:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-700 text-center mb-4">
        New Training Session
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 min-w-[180px] space-y-1">
            <Label htmlFor="date">Date</Label>
            <DatePicker
              date={date}
              onDateChange={handleDateChange}
              id="date"
              required
            />
          </div>

          <div className="flex-1 min-w-[120px] space-y-1">
            <Label htmlFor="dayOfWeek">Day</Label>
            <Input
              id="dayOfWeek"
              value={dayOfWeek}
              readOnly
              className="bg-gray-100"
              tabIndex={-1}
            />
          </div>
          <div className="flex-1 min-w-[100px] space-y-1">
            <Label htmlFor="timeOfDay">Time</Label>
            <TimePicker time={timeOfDay} onTimeChange={setTimeOfDay} />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="goal">Goal</Label>
          <Input
            id="goal"
            placeholder="Training goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <div className="space-y-1 flex-1">
            <Label htmlFor="heartRateStart">Heart Rate (Start)</Label>
            <Input
              id="heartRateStart"
              placeholder="e.g. 90"
              type="number"
              value={heartRateStart}
              onChange={(e) => setHeartRateStart(e.target.value)}
            />
          </div>
          <div className="space-y-1 flex-1">
            <Label htmlFor="heartRateEnd">Heart Rate (End)</Label>
            <Input
              id="heartRateEnd"
              placeholder="e.g. 100"
              type="number"
              value={heartRateEnd}
              onChange={(e) => setHeartRateEnd(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="sessionNote">Session Note</Label>
          <textarea
            id="sessionNote"
            placeholder="Session Notes (optional)"
            value={sessionNote}
            onChange={(e) => setSessionNote(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
          />
        </div>

        <div className="space-y-6">
          {exercises.map((exercise, exIndex) => (
            <ExerciseInput
              index={exIndex}
              key={exIndex}
              exercise={exercise}
              setExercise={(updated) => updateExercise(exIndex, updated)}
              removeExercise={() => removeExercise(exIndex)}
            />
          ))}
        </div>
        <Button
          className="w-full rounded-full py-3 font-bold text-white bg-gray-500 hover:bg-yellow-400 hover:text-black shadow-lg transition-all duration-200 hover:scale-105"
          type="button"
          onClick={addExercise}
        >
          + Add Exercise
        </Button>

        {error && (
          <p className="text-red-600 text-center font-medium">{error}</p>
        )}

        <Button
          className="w-full rounded-full py-3 font-bold text-white bg-gray-500 hover:bg-yellow-400 hover:text-black shadow-lg transition-all duration-200 hover:scale-105"
          type="submit"
        >
          Submit Session
        </Button>
      </form>
    </div>
  );
}
