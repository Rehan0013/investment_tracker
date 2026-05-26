import { auth } from "@/lib/auth";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="container max-w-lg mx-auto p-4 pt-6 md:pt-8 pb-24">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Settings</h1>
      </div>
      <SettingsClient user={{ name: session.user.name, email: session.user.email }} />
    </div>
  );
}
