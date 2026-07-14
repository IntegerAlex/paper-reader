import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import QueryProvider from "@/components/QueryProvider";
import { ToastProvider } from "@/components/Toast";
import SWRegistration from "@/components/SWRegistration";
import MediaQueryProvider from "@/components/MediaQueryProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Paper Reader — Premium PDF Reading",
  description:
    "A premium PDF reading experience that makes digital documents feel like beautifully printed books.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Paper Reader",
  },
};

export const viewport = {
  themeColor: "#8b6914",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body className="min-h-screen" suppressHydrationWarning>
        <SWRegistration />
        <QueryProvider><ToastProvider><ThemeProvider><MediaQueryProvider>{children}</MediaQueryProvider></ThemeProvider></ToastProvider></QueryProvider>
      </body>
    </html>
  );
}
