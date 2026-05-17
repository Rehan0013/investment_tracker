import { getInvestments } from "@/actions/investment.actions";
import { InvestmentsClient } from "./InvestmentsClient";

export default async function InvestmentsPage() {
  const res = await getInvestments();
  const initialInvestments = res.success ? res.investments : [];

  return <InvestmentsClient initialInvestments={initialInvestments} />;
}
