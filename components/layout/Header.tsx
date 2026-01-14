"use client";
import PageLink from "../ui/PageLink";
import { useAuth } from "@/hooks/useAuth";
import { UserMenu } from "./UserMenu";
import Link from "next/link";
import Image from "next/image";
import React from "react";

function Header() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800 flex flex-row items-center justify-between">
      <div className="px-4 py-4">
        <Link href={"/"}>
          <Image src="/logo.png" alt="Kill Switch" width={132} height={32} />
        </Link>
      </div>
      <div className="px-4 py-2 flex flex-row items-center justify-center gap-2 text-xs md:text-sm lg:text-sm">
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
