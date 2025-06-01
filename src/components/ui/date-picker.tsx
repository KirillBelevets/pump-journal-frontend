"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DatePicker({
  date,
  onDateChange,
}: {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  id?: string;
  required?: boolean;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "h-10 max-w-[180px] w-full rounded-full px-4 flex items-center bg-white border border-gray-300 text-gray-900 font-semibold shadow-sm transition-all duration-150 hover:border-yellow-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200",
            "justify-start text-left",
            !date && "text-gray-400"
          )}
        >
          <CalendarIcon className="mr-2 h-5 w-5 text-gray-400" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateChange}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
