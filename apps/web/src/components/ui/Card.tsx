import type { ChildrenProps, ClassNameProps } from "../../types";

// ============================================
// Card Component - Reusable card container
// ============================================

interface CardProps extends ChildrenProps, ClassNameProps {
  variant?: "default" | "elevated" | "bordered";
  padding?: "none" | "sm" | "md" | "lg";
}

const variants = {
  default: "bg-surface border border-stellar-glow shadow-obsidian",
  elevated: "bg-surface border border-stellar-glow shadow-obsidian",
  bordered: "bg-transparent border border-stellar-glow",
};

const paddings = {
  none: "",
  sm: "p-3",
  md: "p-5",
  lg: "p-6",
};

export function Card({
  children,
  variant = "default",
  padding = "md",
  className = "",
}: CardProps) {
  return (
    <div
      className={`rounded-lg ${variants[variant]} ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
}

// Sub-components for composition
interface CardHeaderProps extends ChildrenProps, ClassNameProps {}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: CardHeaderProps) {
  return <h3 className={`text-xl font-semibold text-text-primary ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: CardHeaderProps) {
  return <p className={`text-sm text-text-muted ${className}`}>{children}</p>;
}

export function CardContent({ children, className = "" }: CardHeaderProps) {
  return <div className={`mt-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`mt-4 flex items-center gap-3 ${className}`}>{children}</div>
  );
}
