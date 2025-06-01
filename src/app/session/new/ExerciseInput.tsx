"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Label } from "@radix-ui/react-label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const TEMPO_OPTIONS = [
  { value: "2-0-2", label: "2-0-2 (Normal speed)" },
  { value: "2-1-2", label: "2-1-2 (Pause bottom)" },
  { value: "3-0-1", label: "3-0-1 (Explosive up)" },
  { value: "3-1-3", label: "3-1-3 (Controlled)" },
  { value: "1-0-1", label: "1-0-1 (Fast)" },
  { value: "custom", label: "Custom…" },
];

export default function ExerciseInput({
  exercise,
  setExercise,
  removeExercise,
  index,
}: Props) {
  // Always controlled
  const [localName, setLocalName] = useState(exercise.name ?? "");
  // const [customTempo, setCustomTempo] = useState(
  //   TEMPO_OPTIONS.includes(exercise.tempo) ? "" : exercise.tempo ?? ""
  // );

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
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-10 mt-2 sm:mt-0 sm:ml-2 bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          onClick={removeExercise}
        >
          Remove Exercise
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Tempo as select */}
        <div className="flex flex-col relative">
          <Label
            htmlFor={`tempo-${index}`}
            className="text-xs font-medium mb-1 flex items-center gap-1"
          >
            Tempo
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                Tempo: <b>Eccentric / Pause / Concentric</b>
                <br />
                Example: <b>3-1-2</b> = 3s down, 1s pause, 2s up
              </TooltipContent>
            </Tooltip>
          </Label>
          <Select
            value={exercise.tempo}
            onValueChange={(v) => setExercise({ ...exercise, tempo: v })}
          >
            <SelectTrigger className="h-10 px-4 rounded-full bg-slate-50 border border-gray-300 shadow-sm focus:border-yellow-200 focus:ring-2 focus:ring-yellow-100 font-semibold text-gray-900 transition-all duration-150 placeholder-gray-400">
              <SelectValue placeholder="Select tempo..." />
            </SelectTrigger>

            <SelectContent>
              {TEMPO_OPTIONS.filter((opt) => !!opt.value).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <div className="flex flex-col mt-2">
          <Label
            htmlFor={`comment-${index}`}
            className="text-xs font-medium mb-1"
          >
            Notes
          </Label>
          <textarea
            id={`comment-${index}`}
            placeholder="Any notes for this exercise…"
            value={exercise.comment ?? ""}
            onChange={(e) =>
              setExercise({ ...exercise, comment: e.target.value })
            }
            className="w-full min-h-[44px] max-h-[120px] rounded-full px-4 py-2 bg-slate-50 border border-gray-300 shadow-sm font-semibold text-gray-900 transition-all duration-150 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 placeholder-gray-400 resize-y"
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
                className="h-10 px-4 py-2 rounded-full bg-slate-50 border border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 font-semibold text-gray-900 transition-all duration-150 placeholder-gray-400"
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
                className="h-10 px-4 py-2 rounded-full bg-slate-50 border border-gray-300 shadow-sm focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 font-semibold text-gray-900 transition-all duration-150 placeholder-gray-400"
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
              variant="outline"
              className="col-span-2 mt-2 h-10 w-full sm:w-auto bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => removeSet(setIndex)}
            >
              Remove Set
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        onClick={addSet}
        className="h-10 mt-2 sm:mt-0 sm:ml-2 bg-gray-500 text-white hover:bg-yellow-400 hover:text-black font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105"
      >
        + Add Set
      </Button>
    </section>
  );
}
