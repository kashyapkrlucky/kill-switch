"use client";
import PageLink from "../ui/PageLink";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./UserMenu";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Command, Radio, Search, ShieldCheck } from "lucide-react";

function Header() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 flex h-[70px] flex-row items-center justify-between border-b border-slate-800/90 bg-slate-950/88 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Link
          href={"/"}
          className="flex items-center rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <Image src="/logo.png" alt="Kill Switch" width={132} height={32} />
        </Link>
        <div className="hidden items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200 lg:flex">
          <ShieldCheck className="h-3.5 w-3.5" />
          Production controls
        </div>
      </div>
      <div className="hidden min-w-0 flex-1 justify-center px-8 xl:flex">
        <div className="flex h-9 w-full max-w-xl items-center gap-3 rounded-md border border-slate-800 bg-slate-900/70 px-3 text-sm text-slate-500 shadow-inner shadow-black/20">
          <Search className="h-4 w-4 text-slate-500" />
          <span className="flex-1">Search flags, projects, tokens</span>
          <span className="flex items-center gap-1 rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 text-[11px] text-slate-400">
            <Command className="h-3 w-3" /> K
          </span>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-3 text-xs md:text-sm lg:text-sm">
        <div className="hidden items-center gap-2 rounded-md border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-300 md:flex">
          <Radio className="h-3.5 w-3.5 text-emerald-300" />
          Live
        </div>
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
