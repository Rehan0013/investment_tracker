import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addMonths, differenceInMonths } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type MonthlySnapshot = {
  month: number;
  date: Date;
  openingBalance: number;
  interest: number;
  closingBalance: number;
};

// Returns array of 12 month snapshots
export function getMonthlyBreakdown(principal: number, investingDate: Date): MonthlySnapshot[] {
  const totalProfit = principal * 0.5; // Exactly 50% profit
  const seed = principal + investingDate.getTime();
  let currentSeed = seed;
  
  const weights: number[] = [];
  let sumWeights = 0;
  
  // Pre-generate 12 seeded random weights
  for (let i = 0; i < 12; i++) {
    const x = Math.sin(currentSeed++) * 10000;
    const rand = x - Math.floor(x);
    // Add 0.5 so no month is too low
    const weight = rand + 0.5; 
    weights.push(weight);
    sumWeights += weight;
  }
  
  const snapshots: MonthlySnapshot[] = [];
  let balance = principal;
  
  for (let month = 1; month <= 12; month++) {
    const interest = totalProfit * (weights[month - 1] / sumWeights);
    const newBalance = balance + interest;
    const date = addMonths(investingDate, month);
    
    snapshots.push({
      month,
      date,
      openingBalance: parseFloat(balance.toFixed(2)),
      interest: parseFloat(interest.toFixed(2)),
      closingBalance: parseFloat(newBalance.toFixed(2)),
    });
    balance = newBalance;
  }
  
  // Ensure the last month exactly hits 1.5x due to floating point inaccuracies
  if (snapshots.length === 12) {
      snapshots[11].closingBalance = parseFloat((principal * 1.5).toFixed(2));
      snapshots[11].interest = parseFloat((snapshots[11].closingBalance - snapshots[11].openingBalance).toFixed(2));
  }
  
  return snapshots;
}

// Returns profit earned up to current month (for a live investment)
export function getCurrentProgress(principal: number, investingDate: Date) {
  const today = new Date();
  const monthsElapsed = Math.max(0, differenceInMonths(today, investingDate));
  const clampedMonths = Math.min(monthsElapsed, 12);
  
  if (clampedMonths === 0) {
    return {
      monthsElapsed: 0,
      currentValue: principal,
      profitSoFar: 0,
      percentageComplete: 0,
    };
  }

  const snapshots = getMonthlyBreakdown(principal, investingDate);
  const currentSnapshot = snapshots[clampedMonths - 1];
  const currentValue = currentSnapshot.closingBalance;
  
  return {
    monthsElapsed: clampedMonths,
    currentValue: currentValue,
    profitSoFar: parseFloat((currentValue - principal).toFixed(2)),
    percentageComplete: Math.round((clampedMonths / 12) * 100),
  };
}
