import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
}

const sizeClasses = {
  xs: "h-7 px-2 text-xs",
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-5 text-sm",
  xl: "h-12 px-6 text-base",
};

const variantClasses = {
  primary:
    "border border-emerald-500/60 bg-emerald-600 text-white shadow-lg shadow-emerald-950/30 hover:bg-emerald-500 focus:ring-2 focus:ring-emerald-500",
  secondary:
    "border border-slate-700 bg-slate-800 text-white hover:bg-slate-700 focus:ring-2 focus:ring-slate-500",
  outline:
    "border border-slate-700 bg-transparent text-slate-300 hover:border-slate-500 hover:bg-slate-900 hover:text-white focus:ring-2 focus:ring-slate-500",
  ghost:
    "border border-transparent bg-transparent text-slate-300 hover:bg-slate-900 hover:text-white focus:ring-2 focus:ring-slate-500",
  danger:
    "border border-red-500/60 bg-red-500/15 text-red-300 hover:bg-red-500/25 focus:ring-2 focus:ring-red-500",
};

export function Button({
  children,
  className,
  size = "md",
  variant = "primary",
  icon,
  iconPosition = "left",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const renderIcon = () => {
    if (loading) {
      return (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      );
    }
    return icon;
  };

  const iconElement = renderIcon();
  const showLeftIcon = iconElement && iconPosition === "left";
  const showRightIcon = iconElement && iconPosition === "right";

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {showLeftIcon && <span className="flex-shrink-0">{iconElement}</span>}
      {children}
      {showRightIcon && <span className="flex-shrink-0">{iconElement}</span>}
    </button>
  );
}
