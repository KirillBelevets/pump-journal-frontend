"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@radix-ui/react-label";

export interface Set {
  reps: number;
  weight: number;
}

export interface Exercise {
  name: string;
  tempo: string;
  rest: number;
  comment?: string;
  sets: Set[];
}

interface Props {
  exercise: Exercise;
  setExercise: (ex: Exercise) => void;
  removeExercise: () => void;
  index: number;
}

const TEMPO_OPTIONS = ["2-1-2", "2-0-2", "3-1-3", "3-0-1", "1-1-1", "Custom"];

export default function ExerciseInput({
  exercise,
  setExercise,
  removeExercise,
  index,
}: Props) {
  // Always controlled
  const [localName, setLocalName] = useState(exercise.name ?? "");
  const [customTempo, setCustomTempo] = useState(
    TEMPO_OPTIONS.includes(exercise.tempo) ? "" : exercise.tempo ?? ""
  );

  const handleSetChange = (setIndex: number, updated: Set) => {
    const updatedSets = exercise.sets.map((s, i) =>
      i === setIndex ? updated : s
    );
    setExercise({ ...exercise, sets: updatedSets });
  };

  const addSet = () => {
    setExercise({
      ...exercise,
      sets: [...exercise.sets, { reps: 0, weight: 0 }],
    });
  };

  const removeSet = (setIndex: number) => {
    setExercise({
      ...exercise,
      sets: exercise.sets.filter((_, i) => i !== setIndex),
    });
  };

  // Tempo select logic
  const handleTempoChange = (value: string) => {
    if (value === "Custom") {
      setCustomTempo("");
      setExercise({ ...exercise, tempo: "" });
    } else {
      setCustomTempo("");
      setExercise({ ...exercise, tempo: value });
    }
  };

  return (
    <section className="border p-4 rounded-xl space-y-4 bg-slate-50 mb-6 shadow">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 flex flex-col">
          <Label
            htmlFor={`exercise-name-${index}`}
            className="text-xs font-medium mb-1"
          >
            Exercise Name
          </Label>
          <Input
            id={`exercise-name-${index}`}
            placeholder="Exercise Name"
            value={localName}
            onChange={(e) => {
              setLocalName(e.target.value);
              setExercise({ ...exercise, name: e.target.value });
            }}
            className="font-semibold"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          className="h-10 mt-2 sm:mt-0 sm:ml-2"
          onClick={removeExercise}
        >
          Remove Exercise
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Tempo as select */}
        <div className="flex flex-col">
          <Label
            htmlFor={`tempo-${index}`}
            className="text-xs font-medium mb-1"
          >
            Tempo
          </Label>
          <select
            id={`tempo-${index}`}
            className="w-full rounded-md border border-gray-300 px-2 py-2 bg-white text-gray-800"
            value={
              TEMPO_OPTIONS.includes(exercise.tempo) ? exercise.tempo : "Custom"
            }
            onChange={(e) => handleTempoChange(e.target.value)}
          >
            {TEMPO_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "Custom" ? "Custom…" : opt}
              </option>
            ))}
          </select>
          {exercise.tempo === "" && (
            <Input
              className="mt-2"
              placeholder="Custom tempo"
              value={customTempo}
              onChange={(e) => {
                setCustomTempo(e.target.value);
                setExercise({ ...exercise, tempo: e.target.value });
              }}
            />
          )}
        </div>
        {/* Rest */}
        <div className="flex flex-col">
          <Label htmlFor={`rest-${index}`} className="text-xs font-medium mb-1">
            Rest (s)
          </Label>
          <Input
            id={`rest-${index}`}
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Rest"
            value={exercise.rest === undefined ? "" : exercise.rest}
            onChange={(e) =>
              setExercise({ ...exercise, rest: Number(e.target.value) })
            }
            min={0}
            onFocus={(e) => e.target.select()}
          />
        </div>
        {/* Comment */}
        <div className="flex flex-col">
          <Label
            htmlFor={`comment-${index}`}
            className="text-xs font-medium mb-1"
          >
            Comment
          </Label>
          <Input
            id={`comment-${index}`}
            placeholder="Optional comment for all sets"
            value={exercise.comment ?? ""}
            onChange={(e) =>
              setExercise({ ...exercise, comment: e.target.value })
            }
          />
        </div>
      </div>

      <span className="font-semibold text-sm mb-2 block mt-2">Sets</span>
      <div className="space-y-2">
        {exercise.sets.map((set, setIndex) => (
          <div
            key={setIndex}
            className="grid grid-cols-2 gap-3 items-end bg-white rounded-lg p-2 shadow-sm"
          >
            <div className="flex flex-col">
              <Label
                className="text-xs font-medium mb-1"
                htmlFor={`reps-${index}-${setIndex}`}
              >
                Reps
              </Label>
              <Input
                id={`reps-${index}-${setIndex}`}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={set.reps === undefined ? "" : set.reps}
                onChange={(e) =>
                  handleSetChange(setIndex, {
                    ...set,
                    reps: Number(e.target.value),
                  })
                }
                min={0}
                onFocus={(e) => e.target.select()}
              />
            </div>
            <div className="flex flex-col">
              <Label
                className="text-xs font-medium mb-1"
                htmlFor={`weight-${index}-${setIndex}`}
              >
                Weight
              </Label>
              <Input
                id={`weight-${index}-${setIndex}`}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={set.weight === undefined ? "" : set.weight}
                onChange={(e) =>
                  handleSetChange(setIndex, {
                    ...set,
                    weight: Number(e.target.value),
                  })
                }
                min={0}
                onFocus={(e) => e.target.select()}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              className="col-span-2 mt-2"
              onClick={() => removeSet(setIndex)}
            >
              Remove Set
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" onClick={addSet} className="mt-3 w-full sm:w-auto">
        + Add Set
      </Button>
    </section>
  );
}
