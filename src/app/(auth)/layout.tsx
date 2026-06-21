"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/layout/PageLoader";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log("Login page - Redirecting to home");
      window.location.replace("/");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="flex-1 bg-gray-900 w-full h-full flex items-center justify-center p-4 relative overflow-hidden">
      {children}
    </div>
  );
}
