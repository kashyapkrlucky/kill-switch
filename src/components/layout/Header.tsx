"use client";
import PageLink from "../ui/PageLink";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./UserMenu";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { ShieldCheck } from "lucide-react";

function Header() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 flex h-[70px] flex-row items-center justify-between border-b border-slate-800/90 bg-slate-950/90 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Link href={"/"} className="flex items-center rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <Image src="/logo.png" alt="Kill Switch" width={132} height={32} />
        </Link>
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 lg:flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          Production controls
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-2 text-xs md:text-sm lg:text-sm">
        {user ? (
          <UserMenu />
        ) : (
          <>
            <PageLink href="/sign-in" size="sm">
              Login
            </PageLink>
            <span className="mx-2 text-zinc-200">|</span>
            <PageLink href="/sign-up" size="sm">
              Sign Up
            </PageLink>
          </>
        )}
      </div>
    </header>
  );
}

export default React.memo(Header);
