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
  size = "md",
  ...props
}: ButtonOutlineProps) {
  return (
    <button
      className={`rounded-lg border border-gray-300 transition-colors text-gray-300 cursor-pointer hover:border-gray-200 ${
        size === "sm" ? "px-3 py-1" : size === "lg" ? "px-7 py-3" : "px-5 py-2"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
