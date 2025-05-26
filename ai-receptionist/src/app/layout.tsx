import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Image from "next/image";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lua Receptionist Configuration",
  description: "Configure your AI-powered call tree",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable,
          geistMono.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 hidden md:flex">
                <Link className="mr-6 flex items-center space-x-2" href="/">
                  <Image src="/logo.png" alt="Lua Receptionist Logo" width={32} height={32} className="mr-2" />
                  <span className="hidden font-bold sm:inline-block">
                    Lua Receptionist
                  </span>
                </Link>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
        <Sonner />
      </body>
    </html>
  );
}
