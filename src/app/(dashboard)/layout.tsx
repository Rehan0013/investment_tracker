import { auth } from "@/lib/auth";
import { SidebarRail } from "@/components/dashboard/SidebarRail";
import { TopHeader } from "@/components/dashboard/TopHeader";
import { BottomNav } from "@/components/shared/BottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "Adnan Khan";
  const userEmail = session?.user?.email || "adnan@investment.com";

  return (
    <div className="min-h-screen bg-background text-foreground flex antialiased">
      {/* Left Vertical Icon Rail (Desktop) */}
      <SidebarRail />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopHeader userName={userName} userEmail={userEmail} />

        <main className="flex-1 p-3.5 sm:p-6 lg:p-7 pb-28 md:pb-12 max-w-[1560px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Rail */}
      <BottomNav />
    </div>
  );
}
