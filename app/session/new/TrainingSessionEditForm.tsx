"use client";

import { useState, useEffect } from "react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Label } from "../../../components/ui/label";
import { DatePicker } from "../../../components/ui/date-picker";
import { TimePicker } from "../../../components/ui/time-picker";
import {
  Exercise,
  TrainingSessionFormValues,
  Set,
} from "../../../types/training";

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function TrainingSessionEditForm({
  initial,
  onSave,
  loading,
  error,
}: {
  initial: TrainingSessionFormValues;
  onSave: (updated: TrainingSessionFormValues) => void;
  loading?: boolean;
  error?: string;
}) {
  // Handle Date as Date object for DatePicker

  const [date, setDate] = useState<Date | undefined>(
    initial.date ? new Date(initial.date) : undefined
  );
  const [form, setForm] = useState<TrainingSessionFormValues>({
    ...initial,
    date: initial.date ? initial.date : "",
    timeOfDay: initial.timeOfDay || "",
  });

  // Update dayOfWeek when date changes
  useEffect(() => {
    if (date) {
      const idx = date.getDay();
      setForm((prev) => ({
        ...prev,
        date: date.toISOString().slice(0, 10),
        dayOfWeek: daysOfWeek[idx],
      }));
    } else {
      setForm((prev) => ({ ...prev, date: "", dayOfWeek: "" }));
    }
  }, [date]);

  // Exercise/set handlers
  const handleExerciseChange = (idx: number, ex: Partial<Exercise>) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((e, i) =>
        i === idx ? { ...e, ...ex } : e
      ),
    }));
  };
  const addExercise = () => {
    setForm((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        { name: "", tempo: "", rest: 60, sets: [] },
      ],
    }));
  };
  const removeExercise = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== idx),
    }));
  };
  const handleSetChange = (
    exIdx: number,
    setIdx: number,
    set: Partial<Set>
  ) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) =>
        i === exIdx
          ? {
              ...ex,
              sets: ex.sets.map((s, j) =>
                j === setIdx ? { ...s, ...set } : s
              ),
            }
          : ex
      ),
    }));
  };
  const addSet = (exIdx: number) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) =>
        i === exIdx
          ? { ...ex, sets: [...ex.sets, { reps: 0, weight: 0, comment: "" }] }
          : ex
      ),
    }));
  };
  const removeSet = (exIdx: number, setIdx: number) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) =>
        i === exIdx
          ? { ...ex, sets: ex.sets.filter((_, j) => j !== setIdx) }
          : ex
      ),
    }));
  };
  // Heart rate handler
  const handleHeartRate = (key: "start" | "end", value: string) => {
    setForm((prev) => ({
      ...prev,
      heartRate: {
        start:
          key === "start"
            ? value === ""
              ? 0
              : Number(value)
            : prev.heartRate?.start ?? 0,
        end:
          key === "end"
            ? value === ""
              ? 0
              : Number(value)
            : prev.heartRate?.end ?? 0,
      },
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-4 max-w-lg w-full mx-auto my-6 bg-gradient-to-br from-teal-50 via-white to-yellow-50 rounded-2xl shadow-lg border border-teal-100 p-4 sm:p-8"
    >
      <h1 className="text-2xl font-bold text-gray-700 text-center mb-4">
        Edit Training Session
      </h1>
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 min-w-[180px] space-y-1">
          <Label htmlFor="date">Date</Label>
          <DatePicker date={date} onDateChange={setDate} id="date" required />
        </div>
        <div className="flex-1 min-w-[120px] space-y-1">
          <Label htmlFor="dayOfWeek">Day</Label>
          <Input
            id="dayOfWeek"
            value={form.dayOfWeek || ""}
            readOnly
            className="bg-gray-100"
            tabIndex={-1}
          />
        </div>
        <div className="flex-1 min-w-[100px] space-y-1">
          <Label htmlFor="timeOfDay">Time</Label>
          <TimePicker
            time={form.timeOfDay || ""}
            onTimeChange={(t) => setForm((f) => ({ ...f, timeOfDay: t }))}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="goal">Goal</Label>
        <Input
          id="goal"
          placeholder="Training goal"
          value={form.goal}
          onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))}
        />
      </div>
      <div className="flex gap-4">
        <div className="space-y-1 flex-1">
          <Label htmlFor="heartRateStart">Heart Rate (Start)</Label>
          <Input
            id="heartRateStart"
            placeholder="e.g. 90"
            type="number"
            value={form.heartRate?.start ?? ""}
            onChange={(e) => handleHeartRate("start", e.target.value)}
          />
        </div>
        <div className="space-y-1 flex-1">
          <Label htmlFor="heartRateEnd">Heart Rate (End)</Label>
          <Input
            id="heartRateEnd"
            placeholder="e.g. 100"
            type="number"
            value={form.heartRate?.end ?? ""}
            onChange={(e) => handleHeartRate("end", e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="sessionNote">Session Note</Label>
        <textarea
          id="sessionNote"
          placeholder="Session Notes (optional)"
          value={form.sessionNote || ""}
          onChange={(e) =>
            setForm((f) => ({ ...f, sessionNote: e.target.value }))
          }
          className="w-full min-h-[44px] max-h-[120px] rounded-full px-4 py-2 bg-slate-50 border border-gray-300 shadow-sm font-semibold text-gray-900 transition-all duration-150 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 placeholder-gray-400 resize-y"
        />
      </div>

      <div>
        <h3 className="font-semibold mb-2">Exercises</h3>
        <div className="space-y-3">
          {form.exercises.map((ex, exIdx) => (
            <div
              key={exIdx}
              className="border rounded-xl p-3 mb-2 bg-slate-50 shadow"
            >
              <div className="flex gap-2 items-end">
                <Input
                  placeholder="Exercise Name"
                  value={ex.name}
                  onChange={(e) =>
                    handleExerciseChange(exIdx, { name: e.target.value })
                  }
                  className="flex-1"
                />
                <Input
                  placeholder="Tempo"
                  value={ex.tempo}
                  onChange={(e) =>
                    handleExerciseChange(exIdx, { tempo: e.target.value })
                  }
                  className="w-28"
                />
                <Input
                  placeholder="Rest (s)"
                  type="number"
                  value={ex.rest}
                  onChange={(e) =>
                    handleExerciseChange(exIdx, {
                      rest: Number(e.target.value),
                    })
                  }
                  className="w-24"
                />
                <Button
                  type="button"
                  onClick={() => removeExercise(exIdx)}
                  className="h-10 ml-2 bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                >
                  Remove
                </Button>
              </div>
              <div className="space-y-2 mt-3">
                {ex.sets.map((set, setIdx) => (
                  <div key={setIdx} className="flex gap-2 items-center">
                    <Input
                      placeholder="Reps"
                      type="number"
                      value={set.reps}
                      onChange={(e) =>
                        handleSetChange(exIdx, setIdx, {
                          reps: Number(e.target.value),
                        })
                      }
                      className="w-20"
                    />
                    <Input
                      placeholder="Weight"
                      type="number"
                      value={set.weight}
                      onChange={(e) =>
                        handleSetChange(exIdx, setIdx, {
                          weight: Number(e.target.value),
                        })
                      }
                      className="w-20"
                    />
                    <Input
                      placeholder="Comment"
                      value={set.comment || ""}
                      onChange={(e) =>
                        handleSetChange(exIdx, setIdx, {
                          comment: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={() => removeSet(exIdx, setIdx)}
                      className="h-10 ml-2 bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => addSet(exIdx)}
                  className="h-10 mt-1 bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                >
                  + Add Set
                </Button>
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={addExercise}
            className="h-10 mt-2 bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          >
            + Add Exercise
          </Button>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        type="submit"
        className="w-full rounded-full py-3 font-bold text-white bg-gray-500 hover:bg-yellow-400 hover:text-black shadow-lg transition-all duration-200 hover:scale-105"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
