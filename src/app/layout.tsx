import type { Metadata } from "next";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import { Toaster } from "react-hot-toast";
import { APP_NAME, APP_DESCRIPTION } from "@/core/utils/constants";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="flex min-h-screen flex-col bg-slate-950 text-slate-50 antialiased"
      >
        <Header />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              "border border-slate-700 bg-slate-900 text-sm text-slate-100 shadow-2xl",
          }}
        />
      </body>
    </html>
  );
}
