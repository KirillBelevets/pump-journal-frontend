import * as React from "react";
import { cn } from "../../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-full px-4 py-2 font-semibold text-gray-900 bg-slate-50 border border-gray-300 shadow-sm transition-all duration-150 placeholder-gray-400",
        "focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200",
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
