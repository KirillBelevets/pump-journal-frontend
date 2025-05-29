"use client";

import * as React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface TimePickerProps {
  time: string;
  onTimeChange: (time: string) => void;
}

export function TimePicker({ time, onTimeChange }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const times = Array.from({ length: 24 * 4 }, (_, index) => {
    const hours = Math.floor(index / 4);
    const minutes = (index % 4) * 15;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">{time || "Select Time"}</Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <div className="max-h-60 overflow-y-auto">
          {times.map((t) => (
            <button
              key={t}
              className={`w-full text-left px-4 py-2 hover:bg-accent ${
                t === time ? "bg-accent text-black" : ""
              }`}
              onClick={() => {
                onTimeChange(t);
                setOpen(false);
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
