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
      className={`rounded-full border border-solid border-black/[.08] transition-colors hover:border-transparent cursor-pointer hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] ${
        size === "sm" ? "px-3 py-1" : size === "lg" ? "px-7 py-3" : "px-5 py-2"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
