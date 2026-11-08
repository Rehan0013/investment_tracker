import { auth } from "@/lib/auth";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { redirect } from "next/navigation";
import { getAllBanners } from "@/actions/banner.actions";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const bannersRes = await getAllBanners();
  const banners = bannersRes.banners || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      <div className="border-b border-border/60 pb-3">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Settings & Preferences
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Account identity, festival & bonus carousel banners, theme appearance, and portfolio ledger management.
        </p>
      </div>

      <SettingsClient
        user={{ name: session.user.name, email: session.user.email }}
        banners={banners}
      />
    </div>
  );
}
