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
      <div className="flex h-[calc(100vh-70px)] flex-col overflow-hidden bg-slate-950/70 lg:flex-row">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <main className="mx-auto flex w-full max-w-[1500px] flex-col p-4 sm:p-5 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </Suspense>
  );
}
