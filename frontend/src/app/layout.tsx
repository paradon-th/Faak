import type { Metadata } from "next";
import { Geist, Geist_Mono, Mali } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const mali = Mali({
  weight: ['400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  variable: "--font-mali",
});

export const metadata: Metadata = {
  title: "Faak - บริการรับฝากกระเป๋า",
  description: "Faak บริการรับฝากกระเป๋าเดินทางที่สะดวกและปลอดภัย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${mali.variable}`}>
      <body className="font-sans">
        <LanguageProvider>
        <div className="flex flex-col min-h-screen relative overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-purple-400/50 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob z-[-1]"></div>
          <div className="fixed top-[20%] right-[-10%] w-96 h-96 bg-yellow-300/50 dark:bg-yellow-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-2000 z-[-1]"></div>
          <div className="fixed bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-pink-400/50 dark:bg-pink-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-4000 z-[-1]"></div>
          <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] bg-blue-400/50 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob z-[-1]"></div>
          
          <Navbar />
          <main className="flex-1 relative z-10">{children}</main>
        </div>
        <Toaster position="top-center" />
        </LanguageProvider>
      </body>
    </html>
  );
}
