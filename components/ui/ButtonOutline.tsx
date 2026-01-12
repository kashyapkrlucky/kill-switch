import React from "react";
interface ButtonOutlineProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}
export function ButtonOutline({
  children,
  className,
  size = "sm",
  ...props
}: ButtonOutlineProps) {
  return (
    <button
      className={`rounded-lg border border-gray-400 transition-colors text-gray-300 cursor-pointer hover:border-gray-200 ${
        size === "sm" ? "px-4 py-2 text-xs" : size === "lg" ? "px-7 py-3 text-base" : "px-5 py-2 text-sm"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
