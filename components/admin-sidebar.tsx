"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Eye } from "lucide-react"

interface AdminSidebarProps {
  user: { firstName: string; lastName: string; email: string }
}

const navItems: { label: string; href: string; icon: React.ElementType }[] = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { label: "Produits", href: "/admin/products", icon: Package },
  { label: "Commandes", href: "/admin/orders", icon: ShoppingCart },
  { label: "Utilisateurs", href: "/admin/users", icon: Users },
]

export function AdminSidebar({ user }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken")
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ token }),
      })
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <aside className="w-72 shrink-0 hidden lg:flex flex-col bg-card border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
            M
          </div>
          <span className="font-bold text-xl tracking-tight flex items-center gap-2">
            Mabex
            <Badge className="text-[10px] px-1.5 py-0.5 h-auto">Admin</Badge>
          </span>
        </Link>
      </div>

      {/* User card */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col items-center text-center">
          <Avatar className="w-16 h-16 mb-3 border-2 border-primary">
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <Badge variant="secondary" className="mt-2">
            Administrateur
          </Badge>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-border space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-muted hover:text-foreground rounded-xl transition-colors"
        >
          <Eye className="w-5 h-5" />
          <span className="text-sm">Voir le site</span>
        </Link>
        <Separator className="my-2" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}
