"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lock } from "lucide-react"
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts"
import { CardLimitationsDialog } from "@/components/card-limitations-dialog"
import { ChartModeDialog } from "@/components/chart-mode-dialog"
import { WalletVerificationDialog } from "@/components/wallet-verification-dialog"

interface FinancialData {
  totalIncome: number
  totalPaid: number
  monthlyFee: number
  accountNumber: string
  growthRate: number
  stockValue: number
  annualProfits: Array<{ month: string; value: number }>
  systemLockDays: number
  mainStocksChange: number
}

export function Overview() {
  const [data, setData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    try {
      const response = await fetch("/api/financial-data")
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error("Error fetching financial data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>
  }

  if (!data) {
    return <div className="flex items-center justify-center h-64">Error loading data</div>
  }

  const stockData = [
    { name: "Jan", value: 12000 },
    { name: "Feb", value: 13500 },
    { name: "Mar", value: 11800 },
    { name: "Apr", value: 14200 },
    { name: "May", value: 15100 },
    { name: "Jun", value: 14674 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {/* Account Card */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Linked to main account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-muted-foreground rounded-full" />
              ))}
            </div>
            <span className="font-mono text-lg">{data.accountNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Received</span>
            <span className="text-muted-foreground">Send</span>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Fee */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Monthly regular fee</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.monthlyFee.toFixed(2)}</div>
          <CardLimitationsDialog>
            <Button variant="link" className="p-0 h-auto text-red-500 text-sm">
              Edit card limitations
            </Button>
          </CardLimitationsDialog>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Total Income</CardTitle>
            <Badge variant="outline">Weekly</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.totalIncome.toLocaleString()}</div>
        </CardContent>
      </Card>

      {/* Total Paid */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Total Paid</CardTitle>
            <Badge variant="outline">Weekly</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.totalPaid.toLocaleString()}</div>
          <ChartModeDialog>
            <Button variant="link" className="p-0 h-auto text-orange-500 text-sm">
              View on chart mode
            </Button>
          </ChartModeDialog>
        </CardContent>
      </Card>

      {/* Growth Rate */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Growth Rate</CardTitle>
            <Badge variant="outline">Weekly</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-muted"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${data.growthRate}, 100`}
                  className="text-orange-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{data.growthRate}%</div>
                  <div className="text-xs text-muted-foreground">Growth rate</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Lock */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <CardTitle className="text-sm text-muted-foreground">System Lock</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.systemLockDays} Days</div>
          <div className="text-xs text-muted-foreground mb-2">Until next payment</div>
          <div className="grid grid-cols-7 gap-1">
            {[...Array(35)].map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-sm ${i < data.systemLockDays ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Annual Profits */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Annual profits</CardTitle>
            <Badge variant="outline">2024</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.annualProfits}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Main Stocks */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm text-muted-foreground">Main Stocks</CardTitle>
            <Badge variant="outline" className="text-green-500">
              +{data.mainStocksChange}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-4">${data.stockValue.toLocaleString()}</div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={stockData}>
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Activity Manager */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Activity manager</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Business plans</span>
              <span className="text-2xl font-bold">$36.37K</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Bank loans</span>
                <Progress value={75} className="w-20" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Accounting</span>
                <Progress value={60} className="w-20" />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>HR management</span>
                <Progress value={45} className="w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Verification */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Wallet Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">Complete verification process to secure your wallet</p>
          <WalletVerificationDialog>
            <Button size="sm" className="w-full">
              Enable
            </Button>
          </WalletVerificationDialog>
        </CardContent>
      </Card>

      {/* Review Rating */}
      <Card className="col-span-1">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">Review rating</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">How is your business management going?</p>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Button key={i} variant="outline" size="icon" className="w-8 h-8 bg-transparent">
                <span className="text-lg">
                  {i === 0 ? "😢" : i === 1 ? "😕" : i === 2 ? "😐" : i === 3 ? "😊" : "😍"}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
