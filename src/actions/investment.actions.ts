"use server";

import dbConnect from "@/lib/db";
import Investment from "@/models/Investment";
import { CreateInvestmentInput, UpdateInvestmentInput } from "@/types";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createInvestment(data: CreateInvestmentInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    // Compute returnDate and returnAmount
    let returnDate = data.returnDate ? new Date(data.returnDate) : new Date(data.investingDate);
    if (!data.returnDate) {
      returnDate.setFullYear(returnDate.getFullYear() + 1);
    }
    const roi = data.roi !== undefined ? data.roi : 50;
    const multiplier = roi === 100 ? 2.0 : 1.5;
    const returnAmount = data.amount * multiplier;

    const investment = await Investment.create({
      ...data,
      roi,
      returnDate,
      returnAmount,
      userId: session.user.id,
    });

    revalidatePath("/investments");
    return { success: true, investment: JSON.parse(JSON.stringify(investment)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getInvestments() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const investments = await Investment.find({ userId: session.user.id })
      .sort({ investingDate: -1 })
      .lean();

    return { success: true, investments: JSON.parse(JSON.stringify(investments)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getInvestmentById(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const investment = await Investment.findOne({ _id: id, userId: session.user.id }).lean();
    if (!investment) throw new Error("Investment not found");

    return { success: true, investment: JSON.parse(JSON.stringify(investment)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateInvestment(id: string, data: UpdateInvestmentInput) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const currentInvestment = await Investment.findOne({ _id: id, userId: session.user.id });
    if (!currentInvestment) throw new Error("Investment not found");

    let { amount, investingDate, roi, returnDate: customReturnDate } = data;
    let returnDate, returnAmount;

    if (amount !== undefined || investingDate !== undefined || roi !== undefined || customReturnDate !== undefined) {
      const finalAmount = amount !== undefined ? amount : currentInvestment.amount;
      const finalInvestingDate = investingDate !== undefined ? new Date(investingDate) : currentInvestment.investingDate;
      const finalRoi = roi !== undefined ? roi : (currentInvestment.roi !== undefined ? currentInvestment.roi : 50);

      const multiplier = finalRoi === 100 ? 2.0 : 1.5;
      returnAmount = finalAmount * multiplier;
      
      if (customReturnDate !== undefined) {
        returnDate = new Date(customReturnDate);
      } else if (investingDate !== undefined) {
        returnDate = new Date(finalInvestingDate);
        returnDate.setFullYear(returnDate.getFullYear() + 1);
      } else {
        returnDate = currentInvestment.returnDate;
      }
    }

    const updated = await Investment.findByIdAndUpdate(
      id,
      {
        ...data,
        ...(roi !== undefined && { roi }),
        ...(returnDate && { returnDate }),
        ...(returnAmount && { returnAmount }),
      },
      { new: true }
    ).lean();

    revalidatePath("/investments");
    revalidatePath(`/investments/${id}`);
    
    return { success: true, investment: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function togglePaymentStatus(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const currentInvestment = await Investment.findOne({ _id: id, userId: session.user.id });
    if (!currentInvestment) throw new Error("Investment not found");

    currentInvestment.isPaid = !currentInvestment.isPaid;
    await currentInvestment.save();

    revalidatePath("/investments");
    revalidatePath(`/investments/${id}`);

    return { success: true, isPaid: currentInvestment.isPaid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteInvestment(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const currentInvestment = await Investment.findOne({ _id: id, userId: session.user.id });
    if (!currentInvestment) throw new Error("Investment not found");

    await Investment.findByIdAndDelete(id);

    revalidatePath("/investments");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getDashboardStats() {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const investments = await Investment.find({ userId: session.user.id }).lean();

    let totalAmountInvested = 0;
    let totalReturnAmount = 0;
    let paidCount = 0;
    let pendingCount = 0;

    const monthlyDataMap: Record<string, { totalInvested: number, totalReturn: number }> = {};

    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      monthlyDataMap[key] = { totalInvested: 0, totalReturn: 0 };
    }

    investments.forEach((inv) => {
      totalAmountInvested += inv.amount;
      totalReturnAmount += inv.returnAmount;
      if (inv.isPaid) paidCount++;
      else pendingCount++;

      const invDate = new Date(inv.investingDate);
      const key = `${invDate.getFullYear()}-${invDate.getMonth()}`;
      if (monthlyDataMap[key]) {
        monthlyDataMap[key].totalInvested += inv.amount;
        monthlyDataMap[key].totalReturn += inv.returnAmount;
      }
    });

    const monthlyInvestmentData = Object.keys(monthlyDataMap).map((key) => {
      const [year, month] = key.split("-").map(Number);
      const d = new Date(year, month, 1);
      const monthStr = d.toLocaleString('default', { month: 'short' });
      const yearStr = d.getFullYear().toString().slice(2);
      return {
        month: `${monthStr} ${yearStr}`,
        totalInvested: monthlyDataMap[key].totalInvested,
        totalReturn: monthlyDataMap[key].totalReturn,
      };
    });

    return {
      success: true,
      stats: {
        totalInvestments: investments.length,
        totalAmountInvested,
        totalReturnAmount,
        totalProfitExpected: totalReturnAmount - totalAmountInvested,
        paidCount,
        pendingCount,
        monthlyInvestmentData,
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
