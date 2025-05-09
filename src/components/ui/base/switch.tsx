import React, { forwardRef } from "react";
import { twMerge } from "tailwind-merge";

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <div
        className={twMerge(
          "relative inline-flex h-6 w-11 items-center rounded-full",
          checked ? "bg-blue-600" : "bg-gray-200",
          className
        )}
        onClick={() => onCheckedChange?.(!checked)} // Add click handler
      >
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)} // Keep change handler
          className="sr-only peer"
          {...props}
        />
        <span
          className={twMerge(
            "absolute h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
            checked ? "translate-x-6" : "translate-x-1",
            "peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-opacity-60",
            "peer-checked:translate-x-6",
            "peer:bg-white"
          )}
        />
      </div>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };
