import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get("type") || "financial"
  const range = searchParams.get("range") || "30d"
  const format = searchParams.get("format") || "pdf"

  // Simulate export processing
  await new Promise((resolve) => setTimeout(resolve, 1000))

  if (format === "csv") {
    const csvData = `Date,Revenue,Expenses,Profit
2024-12-01,45000,32000,13000
2024-12-02,48000,35000,13000
2024-12-03,42000,28000,14000
2024-12-04,51000,38000,13000
2024-12-05,47000,33000,14000`

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}-report.csv"`,
      },
    })
  }

  if (format === "pdf") {
    // In a real application, you would generate a PDF here
    const pdfContent = "Mock PDF content for financial report"

    return new NextResponse(pdfContent, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${type}-report.pdf"`,
      },
    })
  }

  return NextResponse.json({ error: "Unsupported format" }, { status: 400 })
}
