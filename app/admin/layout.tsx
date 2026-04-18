"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    if (parsed.role !== "admin") {
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
      <AdminSidebar user={user} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
