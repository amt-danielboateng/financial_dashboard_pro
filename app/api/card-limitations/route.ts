import { type NextRequest, NextResponse } from "next/server"

// Mock card limitations data
let cardLimitations = {
  dailyLimit: 1000,
  monthlyLimit: 5000,
  transactionLimit: 500,
  internationalTransactions: true,
  onlineTransactions: true,
  atmWithdrawals: true,
  contactlessPayments: true,
  merchantCategories: ["grocery", "gas", "restaurants"],
}

export async function GET() {
  return NextResponse.json(cardLimitations)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate the data
    if (body.dailyLimit < 0 || body.monthlyLimit < 0 || body.transactionLimit < 0) {
      return NextResponse.json({ error: "Limits cannot be negative" }, { status: 400 })
    }

    if (body.dailyLimit > body.monthlyLimit) {
      return NextResponse.json({ error: "Daily limit cannot exceed monthly limit" }, { status: 400 })
    }

    // Update limitations
    cardLimitations = { ...cardLimitations, ...body }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Card limitations updated successfully",
      data: cardLimitations,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update card limitations" }, { status: 500 })
  }
}
