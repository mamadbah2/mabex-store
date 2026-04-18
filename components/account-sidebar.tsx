"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  LogOut,
  Headphones,
  ShoppingCart,
} from "lucide-react"

interface AccountSidebarProps {
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

const navItems = [
  { label: "Mon Profil", href: "/profile", icon: User },
  { label: "Mes Commandes", href: "/orders", icon: Package },
  { label: "Panier", href: "/cart", icon: ShoppingCart, showCount: true },
  { label: "Wishlist", href: "#", icon: Heart, disabled: true },
  { label: "Adresses", href: "#", icon: MapPin, disabled: true },
  { label: "Paiements", href: "#", icon: CreditCard, disabled: true },
]

export function AccountSidebar({ user }: AccountSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { state } = useCart()
  const cartItemCount = state.itemCount ?? state.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0

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
    <aside className="space-y-6">
      {/* User Card */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="w-20 h-20 mb-3 border-2 border-primary">
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-lg">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <Badge variant="secondary" className="mt-2">
            Client
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            if (item.disabled) {
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-3 text-muted-foreground/50 rounded-xl cursor-not-allowed"
                  title="Bientôt disponible"
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                  <Badge variant="outline" className="ml-auto text-[10px] px-1.5 py-0">
                    Bientôt
                  </Badge>
                </div>
              )
            }

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
                {item.showCount && cartItemCount > 0 && (
                  <Badge className="ml-auto bg-primary text-primary-foreground text-[10px] px-1.5 py-0 h-5">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
            )
          })}

          <Separator className="my-3" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Déconnexion</span>
          </button>
        </nav>
      </div>

      {/* Support Card */}
      <div className="bg-gradient-to-br from-primary to-emerald-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <Headphones className="w-10 h-10 mb-3" />
          <h4 className="text-lg font-bold mb-2">Besoin d&apos;aide ?</h4>
          <p className="text-sm text-white/90 mb-4">
            Notre équipe support est disponible pour vous aider.
          </p>
          <Button
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-50 font-bold shadow-md"
            size="sm"
          >
            Contacter le support
          </Button>
        </div>
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>
    </aside>
  )
}
