import { forwardRef, type InputHTMLAttributes } from "react";
import type { ClassNameProps } from "../../types";

// ============================================
// Input Component - Reusable input styles
// ============================================

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className">,
    ClassNameProps {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full rounded-md border bg-surface px-4 py-3 text-sm text-text-primary
            placeholder:text-text-muted
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background
            ${
              error
                ? "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/30"
                : "border-border focus:border-accent focus:ring-accent/30"
            }
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
