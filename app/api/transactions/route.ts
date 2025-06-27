import { type NextRequest, NextResponse } from "next/server"

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

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  return NextResponse.json(transactions)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const newTransaction = {
      id: (transactions.length + 1).toString(),
      date: new Date().toISOString().split("T")[0],
      description: body.description,
      amount: body.type === "expense" ? -Math.abs(body.amount) : Math.abs(body.amount),
      type: body.type,
      category: body.category,
      status: "completed" as const,
    }

    transactions.unshift(newTransaction)

    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
