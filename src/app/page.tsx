"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart3, Shield, TrendingUp, Zap, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useSession } from "next-auth/react";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Home() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || "Investor";

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">

      {/* Navbar */}
      <header className="relative z-10 container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <PieChart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">EyeVision</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link href="/dashboard" prefetch={false}>
              <Button className="font-medium gap-2">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" prefetch={false}>
                <Button variant="ghost" className="font-medium hidden sm:inline-flex">Sign In</Button>
              </Link>
              <Link href="/login" prefetch={false}>
                <Button className="font-medium gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center relative z-10">
        <div className="container mx-auto px-6 py-12 md:py-24 lg:py-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm font-medium mb-8 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-warning" fill="currentColor" />
              <span>Introducing Institutional Grade Tracking</span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
              {isAuthenticated ? (
                <>Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-chart-1 to-chart-2">{userName}</span></>
              ) : (
                <>Invest with <span className="text-transparent bg-clip-text bg-gradient-to-r from-chart-1 to-chart-2">precision</span> and <span className="text-transparent bg-clip-text bg-gradient-to-r from-chart-3 to-chart-4">confidence</span></>
              )}
            </motion.h1>
            
            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl leading-relaxed">
              EyeVision provides real-time insights, advanced analytics, and seamless portfolio management for the modern investor.
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/dashboard" prefetch={false} className="w-full sm:w-auto">
                <Button size="lg" className="w-full h-14 px-8 text-base shadow-xl shadow-primary/20 gap-2">
                  Launch Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features" prefetch={false} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full h-14 px-8 text-base bg-background/50 backdrop-blur-md">
                  Explore Features
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div 
            id="features"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32"
          >
            <motion.div variants={fadeIn} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-chart-1/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors duration-500 h-full">
                <div className="h-12 w-12 rounded-xl bg-chart-1/10 flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-chart-1" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Intuitive Analytics</h3>
                <p className="text-muted-foreground">Visualize your growth with beautiful, interactive charts that make complex data simple to understand.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-chart-2/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors duration-500 h-full">
                <div className="h-12 w-12 rounded-xl bg-chart-2/10 flex items-center justify-center mb-6">
                  <TrendingUp className="h-6 w-6 text-chart-2" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real-time Tracking</h3>
                <p className="text-muted-foreground">Monitor your ROI, expected profits, and portfolio performance in real-time without refreshing.</p>
              </div>
            </motion.div>

            <motion.div variants={fadeIn} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-b from-chart-5/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/50 transition-colors duration-500 h-full">
                <div className="h-12 w-12 rounded-xl bg-chart-5/10 flex items-center justify-center mb-6">
                  <Shield className="h-6 w-6 text-chart-5" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Institutional Grade</h3>
                <p className="text-muted-foreground">Built with robust security and reliable infrastructure to keep your financial data private and secure.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 relative z-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EyeVision. All rights reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
