import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InvestTracker",
  description: "Track your investments and returns",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "InvestTracker",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1120",
};

import { SessionProvider } from "@/components/session-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground selection:bg-primary/20">
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-[#090d16] dark:via-[#0c1322] dark:to-[#090d16] animate-gradient-pulse">
              <div 
                className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 dark:bg-primary/40 blur-[100px] mix-blend-screen" 
                style={{ animation: 'orb-pulse 15s ease-in-out infinite' }} 
              />
              <div 
                className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-chart-2/20 dark:bg-chart-2/30 blur-[120px] mix-blend-screen" 
                style={{ animation: 'orb-pulse 18s ease-in-out infinite reverse' }} 
              />
              <div 
                className="absolute top-[20%] left-[40%] w-[40%] h-[40%] rounded-full bg-chart-5/20 dark:bg-chart-5/30 blur-[100px] mix-blend-screen" 
                style={{ animation: 'orb-pulse 20s ease-in-out infinite' }} 
              />
              <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,white,transparent)] opacity-[0.05] dark:opacity-[0.15]" />
            </div>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
