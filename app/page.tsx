"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Overview } from "@/components/overview"
import { Analytics } from "@/components/analytics"
import { Transactions } from "@/components/transactions"
import { Settings } from "@/components/settings"
import { Reports } from "@/components/reports"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!user) {
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />
      case "analytics":
        return <Analytics />
      case "transactions":
        return <Transactions />
      case "reports":
        return <Reports />
      case "settings":
        return <Settings />
      default:
        return <Overview />
    }
  }

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  )
}
