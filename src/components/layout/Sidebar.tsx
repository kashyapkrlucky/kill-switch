"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  KeyIcon,
  LayoutDashboardIcon,
  FolderOpenIcon,
  FlagIcon,
  SettingsIcon,
  ActivityIcon,
} from "lucide-react";
import { APP_VERSION } from "@/core/utils/constants";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboardIcon,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderOpenIcon,
  },
  {
    name: "Flags",
    href: "/flags",
    icon: FlagIcon,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: SettingsIcon,
  },
  {
    name: "API Access",
    href: "/access",
    icon: KeyIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
    <div className="border-b border-slate-800/90 bg-slate-950/80 px-3 py-2 lg:hidden">
      <nav className="flex gap-2 overflow-x-auto">
        {navigation.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                active
                  ? "bg-emerald-500/12 text-emerald-300"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>

    <aside className="hidden h-full w-72 shrink-0 flex-col border-r border-slate-800/90 bg-slate-950/72 backdrop-blur-xl lg:flex">
      <div className="border-b border-slate-800/80 p-4">
        <div className="glass-panel overflow-hidden rounded-lg p-4">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-400/20 bg-emerald-500/15">
              <ActivityIcon className="h-4 w-4 text-emerald-200" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Control Plane</p>
              <p className="text-xs text-slate-400">Flags, access, releases</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["Dev", "Stage", "Prod"].map((label, index) => (
              <div
                key={label}
                className="rounded-md border border-slate-800 bg-slate-950/60 px-2 py-2"
              >
                <div
                  className={`mb-1 h-1 rounded-full ${
                    index === 2 ? "bg-amber-300" : "bg-emerald-300"
                  }`}
                />
                <p className="text-[11px] font-medium text-slate-300">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase text-slate-600">
          Workspace
        </p>
        <ul className="space-y-1">
          {navigation.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.name);
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    active
                      ? "border border-emerald-400/20 bg-emerald-500/12 text-emerald-200 shadow-inner"
                      : "border border-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900 hover:text-white"
                  }`}
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      toggleExpanded(item.name);
                    }
                  }}
                >
                  <item.icon
                    className={`h-4 w-4 flex-shrink-0 ${
                      active ? "text-emerald-200" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span className="flex-1">{item.name}</span>
                  {hasChildren && (
                    <div className="h-3 w-3 flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </div>
                  )}
                </Link>

                {/* Submenu */}
                {hasChildren && isExpanded && (
                  <ul className="ml-6 mt-0.5 space-y-0.5">
                    {item.children?.map((child) => (
                      <li key={child.name}>
                        <Link
                          href={child.href}
                          className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors ${
                            pathname === child.href
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "text-gray-500 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <child.icon className="h-3 w-3 flex-shrink-0" />
                          <span>{child.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-800/80 p-4">
        <div className="hairline-panel rounded-lg p-3">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              Enterprise console
            </span>
            <span className="text-xs text-slate-500">v{APP_VERSION}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.7)]" />
            All systems nominal
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
