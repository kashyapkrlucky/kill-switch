"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, Suspense } from "react";
import PageLoader from "@/components/layout/PageLoader";
import Sidebar from "@/components/layout/Sidebar";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated, loading } = useAuth();
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("Home page - Not authenticated, redirecting to sign-in");
      window.location.replace("/sign-in");
    }
  }, [isAuthenticated, loading]);

  if (loading || !isAuthenticated) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="flex h-[calc(100vh-70px)] bg-gray-900 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col p-3 overflow-y-auto">
          {children}
        </div>
      </div>
    </Suspense>
  );
}
