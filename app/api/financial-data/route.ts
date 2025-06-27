import { NextResponse } from "next/server"

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const mockData = {
    totalIncome: 27345.7,
    totalPaid: 27345.7,
    monthlyFee: 28.0,
    accountNumber: "3122",
    growthRate: 46,
    stockValue: 14674.48,
    systemLockDays: 13,
    mainStocksChange: 9.5,
    annualProfits: [
      { month: "Jan", value: 17000 },
      { month: "Feb", value: 19000 },
      { month: "Mar", value: 15000 },
      { month: "Apr", value: 22000 },
      { month: "May", value: 24000 },
      { month: "Jun", value: 21000 },
      { month: "Jul", value: 26000 },
      { month: "Aug", value: 23000 },
      { month: "Sep", value: 28000 },
      { month: "Oct", value: 25000 },
      { month: "Nov", value: 30000 },
      { month: "Dec", value: 27000 },
    ],
  }

  return NextResponse.json(mockData)
}
