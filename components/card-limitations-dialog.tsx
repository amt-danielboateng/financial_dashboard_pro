"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CreditCard, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CardLimitations {
  dailyLimit: number
  monthlyLimit: number
  transactionLimit: number
  internationalTransactions: boolean
  onlineTransactions: boolean
  atmWithdrawals: boolean
  contactlessPayments: boolean
  merchantCategories: string[]
}

interface CardLimitationsDialogProps {
  children: React.ReactNode
}

export function CardLimitationsDialog({ children }: CardLimitationsDialogProps) {
  const [limitations, setLimitations] = useState<CardLimitations>({
    dailyLimit: 1000,
    monthlyLimit: 5000,
    transactionLimit: 500,
    internationalTransactions: true,
    onlineTransactions: true,
    atmWithdrawals: true,
    contactlessPayments: true,
    merchantCategories: ["grocery", "gas", "restaurants"],
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCardLimitations()
  }, [])

  const fetchCardLimitations = async () => {
    try {
      const response = await fetch("/api/card-limitations")
      if (response.ok) {
        const data = await response.json()
        setLimitations(data)
      }
    } catch (error) {
      console.error("Failed to fetch card limitations:", error)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/card-limitations", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(limitations),
      })

      if (response.ok) {
        toast({
          title: "Settings saved!",
          description: "Your card limitations have been updated successfully.",
        })
      } else {
        throw new Error("Failed to save settings")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save card limitations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCategoryToggle = (category: string) => {
    setLimitations((prev) => ({
      ...prev,
      merchantCategories: prev.merchantCategories.includes(category)
        ? prev.merchantCategories.filter((c) => c !== category)
        : [...prev.merchantCategories, category],
    }))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Edit Card Limitations
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Spending Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Spending Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="dailyLimit">Daily Limit ($)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={limitations.dailyLimit}
                    onChange={(e) =>
                      setLimitations((prev) => ({
                        ...prev,
                        dailyLimit: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyLimit">Monthly Limit ($)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={limitations.monthlyLimit}
                    onChange={(e) =>
                      setLimitations((prev) => ({
                        ...prev,
                        monthlyLimit: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="transactionLimit">Per Transaction ($)</Label>
                  <Input
                    id="transactionLimit"
                    type="number"
                    value={limitations.transactionLimit}
                    onChange={(e) =>
                      setLimitations((prev) => ({
                        ...prev,
                        transactionLimit: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">International Transactions</p>
                  <p className="text-sm text-muted-foreground">Allow transactions outside your country</p>
                </div>
                <Switch
                  checked={limitations.internationalTransactions}
                  onCheckedChange={(checked) =>
                    setLimitations((prev) => ({
                      ...prev,
                      internationalTransactions: checked,
                    }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Online Transactions</p>
                  <p className="text-sm text-muted-foreground">Allow online and e-commerce purchases</p>
                </div>
                <Switch
                  checked={limitations.onlineTransactions}
                  onCheckedChange={(checked) =>
                    setLimitations((prev) => ({
                      ...prev,
                      onlineTransactions: checked,
                    }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">ATM Withdrawals</p>
                  <p className="text-sm text-muted-foreground">Allow cash withdrawals from ATMs</p>
                </div>
                <Switch
                  checked={limitations.atmWithdrawals}
                  onCheckedChange={(checked) =>
                    setLimitations((prev) => ({
                      ...prev,
                      atmWithdrawals: checked,
                    }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Contactless Payments</p>
                  <p className="text-sm text-muted-foreground">Allow tap-to-pay transactions</p>
                </div>
                <Switch
                  checked={limitations.contactlessPayments}
                  onCheckedChange={(checked) =>
                    setLimitations((prev) => ({
                      ...prev,
                      contactlessPayments: checked,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Merchant Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Allowed Merchant Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "grocery",
                  "gas",
                  "restaurants",
                  "shopping",
                  "entertainment",
                  "travel",
                  "healthcare",
                  "utilities",
                  "education",
                ].map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Switch
                      id={category}
                      checked={limitations.merchantCategories.includes(category)}
                      onCheckedChange={() => handleCategoryToggle(category)}
                    />
                    <Label htmlFor={category} className="capitalize">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Important Notice</p>
              <p className="text-yellow-700 dark:text-yellow-300">
                Changes to card limitations may take up to 24 hours to take effect. Some restrictions may require
                additional verification.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={fetchCardLimitations}>
              Reset
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
