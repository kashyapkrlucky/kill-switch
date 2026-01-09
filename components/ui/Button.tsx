import React from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}
export function Button({
  children,
  className,
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-full bg-foreground text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] cursor-pointer ${
        size === "sm" ? "px-3 py-1" : size === "lg" ? "px-7 py-3" : "px-5 py-2"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
