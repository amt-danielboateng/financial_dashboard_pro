import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "financial"
  const range = searchParams.get("range") || "30d"

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const generateReportData = (type: string, range: string) => {
    const baseRevenue = 125000
    const baseExpenses = 85000

    return {
      summary: {
        totalRevenue: baseRevenue,
        totalExpenses: baseExpenses,
        netProfit: baseRevenue - baseExpenses,
        profitMargin: Math.round(((baseRevenue - baseExpenses) / baseRevenue) * 100),
        revenueChange: 12.5,
        expenseChange: 8.3,
        profitChange: 18.7,
        marginChange: 2.1,
      },
      trendData: generateTrendData(range),
      expenseCategories: [
        { name: "Salaries", value: 45000 },
        { name: "Marketing", value: 15000 },
        { name: "Operations", value: 12000 },
        { name: "Technology", value: 8000 },
        { name: "Other", value: 5000 },
      ],
      monthlyPerformance: [
        { month: "Jan", profit: 35000 },
        { month: "Feb", profit: 42000 },
        { month: "Mar", profit: 38000 },
        { month: "Apr", profit: 45000 },
        { month: "May", profit: 52000 },
        { month: "Jun", profit: 48000 },
      ],
      topRevenueSources: [
        { name: "Enterprise Clients", category: "Services", revenue: 65000, change: 15.2 },
        { name: "Product Sales", category: "Products", revenue: 35000, change: 8.7 },
        { name: "Subscriptions", category: "Recurring", revenue: 25000, change: 22.1 },
        { name: "Consulting", category: "Services", revenue: 18000, change: -3.2 },
      ],
    }
  }

  const generateTrendData = (range: string) => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365
    const data = []

    for (let i = 0; i < Math.min(days, 30); i++) {
      const date = new Date()
      date.setDate(date.getDate() - (30 - i))
      data.push({
        date: date.toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 10000) + 35000,
        expenses: Math.floor(Math.random() * 8000) + 25000,
      })
    }

    return data
  }

  const reportData = generateReportData(type, range)
  return NextResponse.json(reportData)
}
