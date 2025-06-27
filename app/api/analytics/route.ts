import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const range = searchParams.get("range") || "7d"

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const generateMockData = (range: string) => {
    const baseData = {
      totalRevenue: 125000,
      revenueGrowth: 12.5,
      activeUsers: 2847,
      userGrowth: 8.3,
      totalTransactions: 1523,
      transactionDecline: 2.1,
      conversionRate: 3.2,
      conversionGrowth: 0.8,
    }

    // Adjust data based on range
    const multiplier = range === "7d" ? 0.1 : range === "30d" ? 0.4 : range === "90d" ? 1.2 : 4.0

    return {
      ...baseData,
      totalRevenue: Math.round(baseData.totalRevenue * multiplier),
      activeUsers: Math.round(baseData.activeUsers * multiplier),
      totalTransactions: Math.round(baseData.totalTransactions * multiplier),
      revenueTrend: generateTrendData(range),
      categoryDistribution: [
        { name: "Services", value: 45 },
        { name: "Products", value: 30 },
        { name: "Subscriptions", value: 15 },
        { name: "Other", value: 10 },
      ],
      monthlyComparison: [
        { month: "Jan", current: 12000, previous: 10000 },
        { month: "Feb", current: 15000, previous: 12000 },
        { month: "Mar", current: 18000, previous: 14000 },
        { month: "Apr", current: 22000, previous: 16000 },
        { month: "May", current: 25000, previous: 18000 },
        { month: "Jun", current: 28000, previous: 20000 },
      ],
      topProducts: [
        { name: "Premium Dashboard", revenue: 45000 },
        { name: "Analytics Suite", revenue: 32000 },
        { name: "API Access", revenue: 28000 },
        { name: "Custom Reports", revenue: 20000 },
      ],
      customerSegments: [
        { name: "Enterprise", percentage: 35 },
        { name: "Small Business", percentage: 45 },
        { name: "Individual", percentage: 20 },
      ],
      avgOrderValue: 245,
      customerLTV: 1250,
      churnRate: 2.3,
    }
  }

  const generateTrendData = (range: string) => {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : range === "90d" ? 90 : 365
    const data = []

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i))
      data.push({
        date: date.toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 5000) + 15000,
      })
    }

    return data
  }

  const mockData = generateMockData(range)
  return NextResponse.json(mockData)
}
