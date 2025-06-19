"use client";

import { useState, useEffect, RefObject } from "react";
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
import { Focusable, FocusWrapper } from "./FocusWrapper";

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
  const [date, setDate] = useState<Date | undefined>(
    initial.date ? new Date(initial.date) : undefined
  );
  const [form, setForm] = useState<TrainingSessionFormValues>({
    ...initial,
    date: initial.date ? initial.date : "",
    timeOfDay: initial.timeOfDay || "",
    exercises:
      initial.exercises && initial.exercises.length > 0
        ? initial.exercises
        : [],
  });

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
        { name: "", tempo: "", rest: 0, sets: [] },
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
        if (form.exercises.some((ex) => ex.name.trim() === "")) {
          alert("Please enter exercise names.");
          return;
        }
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
        <FocusWrapper selectOnFocus>
          {(ref: RefObject<Focusable | null>) => (
            <Input
              ref={ref}
              id="goal"
              placeholder="Training goal"
              value={form.goal}
              onChange={(e) => setForm((f) => ({ ...f, goal: e.target.value }))}
            />
          )}
        </FocusWrapper>
      </div>

      <div className="flex gap-4">
        <div className="space-y-1 flex-1">
          <Label htmlFor="heartRateStart">Heart Rate (Start)</Label>
          <FocusWrapper selectOnFocus>
            {(ref: RefObject<Focusable | null>) => (
              <Input
                ref={ref}
                id="heartRateStart"
                placeholder="e.g. 90"
                type="number"
                value={form.heartRate?.start ?? ""}
                onChange={(e) => handleHeartRate("start", e.target.value)}
              />
            )}
          </FocusWrapper>
        </div>
        <div className="space-y-1 flex-1">
          <Label htmlFor="heartRateEnd">Heart Rate (End)</Label>
          <FocusWrapper selectOnFocus>
            {(ref: RefObject<Focusable | null>) => (
              <Input
                ref={ref}
                id="heartRateEnd"
                placeholder="e.g. 100"
                type="number"
                value={form.heartRate?.end ?? ""}
                onChange={(e) => handleHeartRate("end", e.target.value)}
              />
            )}
          </FocusWrapper>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Exercises</h3>
        <div className="space-y-3">
          {form.exercises.map((ex, exIdx) => (
            <div
              key={exIdx}
              className="border rounded-xl p-3 mb-2 bg-slate-50 shadow"
            >
              <div className="space-y-2">
                {/* Row 1: Exercise Name (always full width) */}
                <div className="space-y-1">
                  <Label htmlFor={`exercise-${exIdx}`}>Exercise</Label>
                  <FocusWrapper selectOnFocus>
                    {(ref) => (
                      <Input
                        ref={ref}
                        id={`exercise-${exIdx}`}
                        placeholder="e.g. Squats"
                        value={ex.name}
                        onChange={(e) =>
                          handleExerciseChange(exIdx, { name: e.target.value })
                        }
                        className="w-full"
                      />
                    )}
                  </FocusWrapper>
                </div>

                {/* Row 2: Tempo + Rest + Remove (wraps on mobile) */}
                <div className="flex flex-wrap sm:flex-nowrap gap-3 items-end">
                  <div className="flex-1 min-w-[100px] space-y-1">
                    <Label htmlFor={`tempo-${exIdx}`}>Tempo</Label>
                    <FocusWrapper selectOnFocus>
                      {(ref) => (
                        <Input
                          ref={ref}
                          id={`tempo-${exIdx}`}
                          placeholder="e.g. 3-1-1"
                          value={ex.tempo}
                          onChange={(e) =>
                            handleExerciseChange(exIdx, {
                              tempo: e.target.value,
                            })
                          }
                          className="w-full"
                        />
                      )}
                    </FocusWrapper>
                  </div>

                  <div className="flex-1 min-w-[80px] space-y-1">
                    <Label htmlFor={`rest-${exIdx}`}>Rest (sec)</Label>
                    <FocusWrapper selectOnFocus>
                      {(ref) => (
                        <Input
                          ref={ref}
                          id={`rest-${exIdx}`}
                          placeholder="e.g. 90"
                          type="number"
                          value={ex.rest}
                          onChange={(e) =>
                            handleExerciseChange(exIdx, {
                              rest: Number(e.target.value),
                            })
                          }
                          className="w-full"
                        />
                      )}
                    </FocusWrapper>
                  </div>

                  <div className="sm:mt-6 mt-2">
                    <Button
                      type="button"
                      onClick={() => removeExercise(exIdx)}
                      className="h-10 bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-3">
                {ex.sets.map((set, setIdx) => (
                  <div
                    key={setIdx}
                    className="flex flex-col gap-2 sm:gap-3 border border-gray-200 rounded-lg p-3"
                  >
                    {/* Row 1: Reps & Weight */}
                    <div className="flex gap-2">
                      <div className="flex-1 min-w-0 space-y-1">
                        <Label htmlFor={`reps-${exIdx}-${setIdx}`}>Reps</Label>
                        <FocusWrapper selectOnFocus>
                          {(ref: RefObject<Focusable | null>) => (
                            <Input
                              ref={ref}
                              id={`reps-${exIdx}-${setIdx}`}
                              type="number"
                              placeholder="e.g. 10"
                              value={set.reps}
                              onChange={(e) =>
                                handleSetChange(exIdx, setIdx, {
                                  reps: Number(e.target.value),
                                })
                              }
                            />
                          )}
                        </FocusWrapper>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <Label htmlFor={`weight-${exIdx}-${setIdx}`}>
                          Weight
                        </Label>
                        <FocusWrapper selectOnFocus>
                          {(ref: RefObject<Focusable | null>) => (
                            <Input
                              ref={ref}
                              id={`weight-${exIdx}-${setIdx}`}
                              type="number"
                              placeholder="e.g. 50"
                              value={set.weight}
                              onChange={(e) =>
                                handleSetChange(exIdx, setIdx, {
                                  weight: Number(e.target.value),
                                })
                              }
                            />
                          )}
                        </FocusWrapper>
                      </div>
                    </div>

                    {/* Row 2: Comment & Remove */}
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor={`comment-${exIdx}-${setIdx}`}>
                          Comment
                        </Label>
                        <FocusWrapper selectOnFocus>
                          {(ref: RefObject<Focusable | null>) => (
                            <Input
                              ref={ref}
                              id={`comment-${exIdx}-${setIdx}`}
                              placeholder="Optional note"
                              value={set.comment || ""}
                              onChange={(e) =>
                                handleSetChange(exIdx, setIdx, {
                                  comment: e.target.value,
                                })
                              }
                            />
                          )}
                        </FocusWrapper>
                      </div>

                      <div className="pt-1 sm:pt-0">
                        <Button
                          type="button"
                          onClick={() => removeSet(exIdx, setIdx)}
                          className="h-10 bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={() => addSet(exIdx)}
                className="h-10 mt-1 bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              >
                + Add Set
              </Button>
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
