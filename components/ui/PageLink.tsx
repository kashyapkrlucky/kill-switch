import Link from "next/link";

interface PageLinkProps {
  href: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  className?: string;
}

export default function PageLink({
  href,
  children,
  size = "base",
  className = "",
}: PageLinkProps) {
  return (
    <Link
      href={href}
      className={`font-medium text-zinc-50 text-${size} ${className}`}
    >
      {children}
    </Link>
  );
}
