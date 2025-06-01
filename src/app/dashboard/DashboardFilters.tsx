import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";

const DAYS = [
  "any",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export interface DashboardFilterState {
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  dayOfWeek: string;
  exercise: string;
  goal: string;
}

export function DashboardFilters({
  filters,
  setFilters,
}: {
  filters: DashboardFilterState;
  setFilters: (f: DashboardFilterState) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3 mb-6 items-end bg-slate-50/70 px-4 py-3 rounded-2xl border border-slate-100 shadow">
      {/* Date Range */}
      <div>
        <Label className="block mb-1">From</Label>
        <DatePicker
          date={filters.dateFrom}
          onDateChange={(date) => setFilters({ ...filters, dateFrom: date })}
          id="dateFrom"
        />
      </div>
      <div>
        <Label className="block mb-1">To</Label>
        <DatePicker
          date={filters.dateTo}
          onDateChange={(date) => setFilters({ ...filters, dateTo: date })}
          id="dateTo"
        />
      </div>
      {/* Day of Week */}
      <div>
        <Label className="block mb-1">Day</Label>
        <Select
          value={filters.dayOfWeek}
          onValueChange={(val) => setFilters({ ...filters, dayOfWeek: val })}
        >
          <SelectTrigger className="h-10 rounded-full bg-slate-50 border border-gray-300">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            {DAYS.map((d) => (
              <SelectItem key={d} value={d}>
                {d === "any" ? "Any" : d}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Exercise */}
      <div>
        <Label className="block mb-1">Exercise</Label>
        <Input
          type="text"
          placeholder="Search exercise"
          value={filters.exercise}
          onChange={(e) => setFilters({ ...filters, exercise: e.target.value })}
          className="h-10 rounded-full"
        />
      </div>
      {/* Goal */}
      <div>
        <Label className="block mb-1">Goal</Label>
        <Input
          type="text"
          placeholder="e.g. Strength"
          value={filters.goal}
          onChange={(e) => setFilters({ ...filters, goal: e.target.value })}
          className="h-10 rounded-full"
        />
      </div>
    </div>
  );
}
