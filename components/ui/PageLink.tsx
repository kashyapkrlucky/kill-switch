import Link from "next/link";

interface PageLinkProps {
  href: string;
  children: React.ReactNode;
  size?: "xs" | "sm" | "base" | "lg" | "xl";
}

export default function PageLink({
  href,
  children,
  size = "base",
}: PageLinkProps) {
  return (
    <Link
      href={href}
      className={`font-medium text-zinc-950 dark:text-zinc-50 text-${size}`}
    >
      {children}
    </Link>
  );
}
