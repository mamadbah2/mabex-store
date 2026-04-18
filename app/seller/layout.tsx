"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SellerSidebar } from "@/components/seller-sidebar"

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")
    if (!token || !userData) {
      router.push("/")
      return
    }
    const parsed = JSON.parse(userData)
    if (parsed.role !== "seller" && parsed.role !== "admin") {
      router.push("/")
      return
    }
    setUser(parsed)
  }, [])

  if (!user) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="w-72 shrink-0 hidden lg:block bg-card border-r border-border h-screen animate-pulse" />
        <div className="flex-1" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <SellerSidebar user={user} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
