"use client";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, Suspense } from "react";
import PageLoader from "@/components/layout/PageLoader";

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
      <div className="flex-1 w-full h-full flex p-4 relative overflow-hidden bg-gray-900">
        {children}
      </div>
    </Suspense>
  );
}
