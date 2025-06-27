"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Menu, Bell, Sun, Moon, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { ShareTasksDialog } from "@/components/share-tasks-dialog"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "analytics", label: "Analytics" },
  { id: "transactions", label: "Transactions" },
  { id: "reports", label: "Reports" },
  { id: "settings", label: "Settings" },
]

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [currentDate, setCurrentDate] = useState(new Date())
  const { user, logout } = useAuth()

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentDate(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  const formatDate = (date: Date) => {
    const day = date.getDate()
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
    const month = date.toLocaleDateString("en-US", { month: "long" })
    return { day, dayName, month }
  }

  const { day, dayName, month } = formatDate(currentDate)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Menu className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">Financial</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Start searching here..." className="w-64 pl-10" />
            </div>

            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>JW</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium">Jack Watson</p>
                    <p className="text-xs text-muted-foreground">CTO Assistant</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onTabChange("settings")}>Settings</DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="border-b bg-card/30">
        <div className="flex items-center px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Date and Help Section */}
      <div className="flex items-center justify-between px-6 py-4 bg-card/20">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold">{day}</div>
            <div className="text-sm text-muted-foreground">
              {dayName}, {month}
            </div>
          </div>
          <ShareTasksDialog>
            <Button variant="outline" size="sm" className="text-orange-500 border-orange-500 bg-transparent">
              Share my Tasks →
            </Button>
          </ShareTasksDialog>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <h3 className="text-lg font-semibold">Hey, Need Help?</h3>
            <p className="text-sm text-muted-foreground">Just ask me anything!</p>
          </div>
          <Button size="icon" variant="outline">
            <Mic className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  )
}
