import { Navbar } from "@/components/shared/Navbar";
import { BottomNav } from "@/components/shared/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      <Navbar />
      <main className="flex-1 pb-16 sm:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
