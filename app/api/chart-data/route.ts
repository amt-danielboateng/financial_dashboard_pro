import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const range = searchParams.get("range") || "6months"

  // Generate mock data based on time range
  const generateData = (months: number) => {
    const data = []
    const now = new Date()

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      // Generate realistic financial data with some variation
      const baseIncome = 25000 + Math.random() * 10000
      const baseExpenses = 18000 + Math.random() * 8000

      data.push({
        name: monthName,
        income: Math.round(baseIncome),
        expenses: Math.round(baseExpenses),
        net: Math.round(baseIncome - baseExpenses),
      })
    }

    return data
  }

  let months = 6
  switch (range) {
    case "3months":
      months = 3
      break
    case "6months":
      months = 6
      break
    case "1year":
      months = 12
      break
    case "2years":
      months = 24
      break
  }

  const data = generateData(months)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json(data)
}
