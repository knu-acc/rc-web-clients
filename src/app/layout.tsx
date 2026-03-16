import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import SitePasswordGate from "@/components/auth/SitePasswordGate";
import { ThemeProvider } from "next-themes";
import MaterialProvider from "@/components/material/MaterialProvider";
import BlobDecoration from "@/components/layout/BlobDecoration";

const notoSans = Noto_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRM — Проекты",
  description: "Личная CRM-система",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      noarchive: true,
      nosnippet: true,
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${notoSans.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MaterialProvider>
            <BlobDecoration />
            <SitePasswordGate>{children}</SitePasswordGate>
          </MaterialProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
