"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, LogOut, Package, Menu, X } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import type { User as UserType } from "@/lib/types"
import { authFetch } from "@/lib/api-client"

export function Header() {
  const [user, setUser] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { state } = useCart()
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authFetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken')

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ token })
      })

      // Clear token from localStorage
      localStorage.removeItem('authToken')
      setUser(null)
      setMobileMenuOpen(false)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const cartItemCount = state.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMobileMenu}>
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Package className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">Mabex</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              Produits
            </Link>
            {user && (
              <>
                <Link href="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  Mon Profil
                </Link>
                <Link href="/orders" className="text-muted-foreground hover:text-primary transition-colors">
                  Mes Commandes
                </Link>
                {user.role === "seller" && (
                  <Link href="/seller" className="text-muted-foreground hover:text-primary transition-colors">
                    Dashboard Vendeur
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                    Administration
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs">{cartItemCount}</Badge>
                )}
              </Button>
            </Link>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center space-x-2">
              {loading ? (
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
              ) : user ? (
                <>
                  <span className="text-sm text-muted-foreground">Bonjour, {user.firstName}</span>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30">
                      Inscription
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Produits
              </Link>

              {user && (
                <>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Mon Profil
                  </Link>
                  <Link
                    href="/orders"
                    className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                    onClick={closeMobileMenu}
                  >
                    Mes Commandes
                  </Link>
                  {user.role === "seller" && (
                    <Link
                      href="/seller"
                      className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Dashboard Vendeur
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                      onClick={closeMobileMenu}
                    >
                      Administration
                    </Link>
                  )}
                </>
              )}

              {/* User Actions */}
              <div className="border-t border-border pt-4 mt-4">
                {loading ? (
                  <div className="px-3 py-2">
                    <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
                  </div>
                ) : user ? (
                  <div className="px-3 py-2 space-y-2">
                    <div className="text-sm text-muted-foreground font-medium">
                      Bonjour, {user.firstName}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-muted-foreground hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <div className="px-3 py-2 space-y-2">
                    <Link href="/login" className="block" onClick={closeMobileMenu}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/register" className="block" onClick={closeMobileMenu}>
                      <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                        Inscription
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
