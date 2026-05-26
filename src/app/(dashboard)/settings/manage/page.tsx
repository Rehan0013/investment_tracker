import { auth } from "@/lib/auth";
import { getInvestments } from "@/actions/investment.actions";
import { ManageInvestmentsClient } from "@/components/settings/ManageInvestmentsClient";
import { redirect } from "next/navigation";

export default async function ManageInvestmentsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const res = await getInvestments();
  const initialInvestments = res.success ? res.investments : [];

  return (
    <div className="container max-w-4xl mx-auto p-4 pt-6 md:pt-8 pb-24">
      <ManageInvestmentsClient initialInvestments={initialInvestments} />
    </div>
  );
}
