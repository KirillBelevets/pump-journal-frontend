"use client";

import * as React from "react";
import { ClockIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { Button } from "./button";
import clsx from "clsx";

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
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-full px-4 bg-white border border-gray-300 text-gray-900 font-semibold shadow-sm transition-all duration-150 hover:border-yellow-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
        >
          <span className="flex w-full items-center justify-between">
            <span
              className={clsx(
                "truncate",
                time ? "" : "text-gray-400",
                "min-w-[60px]"
              )}
            >
              {" "}
              {time || "Select Time"}
            </span>
            <ClockIcon className="ml-2 w-5 h-5 text-gray-400" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-0">
        <div className="max-h-60 overflow-y-auto">
          {times.map((t) => (
            <button
              key={t}
              className={`w-full text-left px-4 py-2 transition-colors ${
                t === time
                  ? "bg-yellow-100 text-yellow-700 font-bold"
                  : "hover:bg-yellow-50"
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
