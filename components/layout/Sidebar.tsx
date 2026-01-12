"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FolderOpen, 
  Flag, 
  Settings, 
  Home,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    name: "Flags",
    href: "/flags",
    icon: Flag,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
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
    <div className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col h-full">


      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-0.5">
          {navigation.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems.includes(item.name);
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    active
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "text-gray-400 hover:text-white hover:bg-slate-800"
                  }`}
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      toggleExpanded(item.name);
                    }
                  }}
                >
                  <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="flex-1">{item.name}</span>
                  {hasChildren && (
                    <div className="w-3 h-3 flex-shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
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
                          className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs transition-colors ${
                            pathname === child.href
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "text-gray-500 hover:text-white hover:bg-slate-800"
                          }`}
                        >
                          <child.icon className="w-3 h-3 flex-shrink-0" />
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

      {/* Footer */}
      <div className="p-2 border-t border-slate-800">
        <div className="text-xs text-gray-500 text-center">
          Version 1.0.0
        </div>
      </div>
    </div>
  );
}
