import type { Metadata } from "next";
import { Mona_Sans,Noto_Sans,Roboto_Condensed, Nunito_Sans, Inconsolata } from "next/font/google";
import "@/styles/globals.css";
import Header from "@/components/layout/Header";
import { Toaster } from "react-hot-toast";
import { APP_NAME, APP_DESCRIPTION } from "@/core/utils/constants";

// const robotoCondensed = Roboto_Condensed({
//   variable: "--font-roboto-condensed",
//   subsets: ["latin"],
// });

// const nunitoSans = Nunito_Sans({
//   variable: "--font-nunito-sans",
//   subsets: ["latin"],
// });

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

// const monaSans = Mona_Sans({
//   variable: "--font-mona-sans",
//   subsets: ["latin"],
// });

// const inconsolata = Inconsolata({
//   variable: "--font-inconsolata",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: APP_NAME,
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
        className={`${notoSans.className}  antialiased flex flex-col min-h-screen`}
      >
        <Header />
        <div className="flex-1 bg-zinc-50 dark:bg-black overflow-hidden h-full flex flex-col">
          {children}
          <Toaster />
        </div>
      </body>
    </html>
  );
}
