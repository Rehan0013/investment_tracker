"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateInvestmentSchema, UpdateInvestmentInput } from "@/types";
import { updateInvestment } from "@/actions/investment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { useTransition, useState, useEffect } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import { format } from "date-fns";

export function InvestmentEditSheet({ investment }: { investment: any }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateInvestmentInput>({
    resolver: zodResolver(UpdateInvestmentSchema),
    defaultValues: {
      investorName: investment.investorName,
      amount: investment.amount,
      mobileNo: investment.mobileNo,
      aadharNo: investment.aadharNo,
      investingDate: format(new Date(investment.investingDate), "yyyy-MM-dd") as unknown as Date,
    }
  });

  useEffect(() => {
    reset({
      investorName: investment.investorName,
      amount: investment.amount,
      mobileNo: investment.mobileNo,
      aadharNo: investment.aadharNo,
      investingDate: format(new Date(investment.investingDate), "yyyy-MM-dd") as unknown as Date,
    });
  }, [investment, reset]);

  const onSubmit = (data: UpdateInvestmentInput) => {
    startTransition(async () => {
      const res = await updateInvestment(investment._id, data);
      if (res.success) {
        toast.success("Investment updated successfully");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to update investment");
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 gap-2 border-border text-foreground">
          <Edit className="w-4 h-4" /> Edit
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] sm:h-full sm:w-[400px] overflow-y-auto bg-surface border-border">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-foreground">Edit Investment</SheetTitle>
          <SheetDescription>Update the details of this investment.</SheetDescription>
        </SheetHeader>

        <form id="edit-inv-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-investorName">Investor Name</Label>
            <Input id="edit-investorName" {...register("investorName")} className="bg-input focus-visible:ring-primary" />
            {errors.investorName && <p className="text-xs text-danger">{errors.investorName.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-amount">Amount (₹)</Label>
            <Input
              id="edit-amount"
              type="number"
              {...register("amount", { valueAsNumber: true })}
              className="bg-input focus-visible:ring-primary"
            />
            {errors.amount && <p className="text-xs text-danger">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-mobileNo">Mobile Number</Label>
            <Input
              id="edit-mobileNo"
              type="tel"
              inputMode="numeric"
              {...register("mobileNo")}
              className="bg-input focus-visible:ring-primary"
            />
            {errors.mobileNo && <p className="text-xs text-danger">{errors.mobileNo.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-aadharNo">Aadhar Number</Label>
            <Input
              id="edit-aadharNo"
              type="number"
              {...register("aadharNo")}
              className="bg-input focus-visible:ring-primary"
            />
            {errors.aadharNo && <p className="text-xs text-danger">{errors.aadharNo.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-investingDate">Investing Date</Label>
            <Input
              id="edit-investingDate"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              {...register("investingDate", { valueAsDate: true })}
              className="bg-input focus-visible:ring-primary w-full"
            />
            {errors.investingDate && <p className="text-xs text-danger">{errors.investingDate.message}</p>}
          </div>

          <div className="pt-4 flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1 border-border text-foreground" disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
