import { type NextRequest, NextResponse } from "next/server"

// Mock transactions data (same as in transactions route)
const transactions = [
  {
    id: "1",
    date: "2024-12-19",
    description: "Monthly Subscription Payment",
    amount: 2500.0,
    type: "income" as const,
    category: "Subscriptions",
    status: "completed" as const,
  },
  {
    id: "2",
    date: "2024-12-18",
    description: "Office Supplies",
    amount: -450.0,
    type: "expense" as const,
    category: "Office",
    status: "completed" as const,
  },
  {
    id: "3",
    date: "2024-12-17",
    description: "Client Project Payment",
    amount: 8500.0,
    type: "income" as const,
    category: "Services",
    status: "completed" as const,
  },
  {
    id: "4",
    date: "2024-12-16",
    description: "Software License",
    amount: -299.0,
    type: "expense" as const,
    category: "Software",
    status: "pending" as const,
  },
  {
    id: "5",
    date: "2024-12-15",
    description: "Marketing Campaign",
    amount: -1200.0,
    type: "expense" as const,
    category: "Marketing",
    status: "completed" as const,
  },
  {
    id: "6",
    date: "2024-12-14",
    description: "Consulting Services",
    amount: 3500.0,
    type: "income" as const,
    category: "Services",
    status: "completed" as const,
  },
  {
    id: "7",
    date: "2024-12-13",
    description: "Equipment Purchase",
    amount: -2800.0,
    type: "expense" as const,
    category: "Equipment",
    status: "failed" as const,
  },
  {
    id: "8",
    date: "2024-12-12",
    description: "Product Sales",
    amount: 4200.0,
    type: "income" as const,
    category: "Products",
    status: "completed" as const,
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"

    if (format === "csv") {
      // Generate CSV content
      const csvHeaders = ["Date", "Description", "Category", "Amount", "Type", "Status"]
      const csvRows = transactions.map((transaction) => [
        transaction.date,
        `"${transaction.description}"`,
        transaction.category,
        transaction.amount,
        transaction.type,
        transaction.status,
      ])

      const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.join(","))].join("\n")

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="transactions-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      })
    }

    return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Export failed" }, { status: 500 })
  }
}
