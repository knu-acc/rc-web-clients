import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import SitePasswordGate from "@/components/auth/SitePasswordGate";
import { ThemeProvider } from "next-themes";
import MaterialProvider from "@/components/material/MaterialProvider";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin", "cyrillic"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRM — Проекты",
  description: "Личная CRM-система",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={`${roboto.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <MaterialProvider>
            <SitePasswordGate>{children}</SitePasswordGate>
          </MaterialProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
