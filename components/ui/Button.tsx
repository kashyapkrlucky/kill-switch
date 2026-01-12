import React from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}
export function Button({
  children,
  className,
  size = "sm",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center gap-1 rounded-lg border border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-pointer ${
        size === "sm" ? "px-4 py-2 text-xs" : size === "lg" ? "px-7 py-3 text-base" : "px-5 py-2 text-sm"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
