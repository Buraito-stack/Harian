import type { ClassNameProps } from "../../types";

// ============================================
// Button Component - Reusable button styles
// ============================================

interface ButtonProps extends ClassNameProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  isLoading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
}

const variants = {
  primary:
    "bg-accent text-stellar-bg font-semibold shadow-filament hover:brightness-110 hover:shadow-filament-glow active:scale-[0.98]",
  secondary:
    "bg-surface text-text-primary border border-stellar-glow hover:bg-surface-hover active:scale-[0.98]",
  ghost: "text-text-secondary hover:text-text-primary hover:bg-surface-hover active:scale-[0.98]",
  danger:
    "bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-500 hover:brightness-110 active:scale-[0.98]",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-md",
  md: "px-4 py-2.5 text-sm rounded-md",
  lg: "px-6 py-3 text-base rounded-md",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  isLoading = false,
  fullWidth = false,
  className = "",
  onClick,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200 ease-out
        focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-background
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
