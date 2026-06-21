"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import axios from "@/core/lib/axios";
import { useAuth } from "@/hooks/useAuth";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Generate initials from user's name or email
  const getInitials = () => {
    if (user?.username) {
      return user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleLogout = async () => {
    try {
      // Call API to clear server-side auth cookie
      await axios.post("/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Always clear client-side data and redirect
      logout();
      window.location.href = "/";
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-6 h-6 bg-emerald-500 rounded-lg text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {getInitials()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl bg-gray-800 border border-gray-700 ring-opacity-5 z-50 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-700">
            <p className="text-sm font-semibold text-gray-200 truncate">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || ""}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center px-4 py-3 border-t border-gray-700  text-sm text-red-600 transition-colors duration-200"
            role="menuitem"
          >
            <LogOut className="mr-3 h-5 w-5 text-red-600" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
