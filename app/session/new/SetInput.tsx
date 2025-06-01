"use client";

import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export interface Set {
  reps: number;
  weight: number;
  tempo: string;
  rest: number;
  comment?: string;
}

export default function SetInput({
  set,
  setSet,
  removeSet,
}: {
  set: Set;
  setSet: (updated: Set) => void;
  removeSet: () => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-4 items-end mb-2 bg-slate-50 rounded-md p-3">
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1" htmlFor="reps">
          Reps
        </label>
        <Input
          id="reps"
          type="number"
          value={set.reps}
          onChange={(e) => setSet({ ...set, reps: Number(e.target.value) })}
          min={0}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1" htmlFor="weight">
          Weight
        </label>
        <Input
          id="weight"
          type="number"
          value={set.weight}
          onChange={(e) => setSet({ ...set, weight: Number(e.target.value) })}
          min={0}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1" htmlFor="tempo">
          Tempo
        </label>
        <Input
          id="tempo"
          value={set.tempo}
          onChange={(e) => setSet({ ...set, tempo: e.target.value })}
          placeholder="e.g. 2-1-2"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1" htmlFor="rest">
          Rest (s)
        </label>
        <Input
          id="rest"
          type="number"
          value={set.rest}
          onChange={(e) => setSet({ ...set, rest: Number(e.target.value) })}
          min={0}
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-medium mb-1" htmlFor="comment">
          Comment
        </label>
        <Input
          id="comment"
          value={set.comment || ""}
          onChange={(e) => setSet({ ...set, comment: e.target.value })}
          placeholder="Optional"
        />
      </div>
      <div className="flex flex-col justify-end">
        <Button
          type="button"
          variant="destructive"
          onClick={removeSet}
          className="w-full"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}
