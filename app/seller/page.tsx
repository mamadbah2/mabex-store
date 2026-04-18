"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, TrendingUp, Clock, Plus } from "lucide-react"
import Link from "next/link"

interface SellerStats {
  totalProducts: number
  activeProducts: number
  totalOrders: number
  totalRevenue: number
  ordersByStatus: Record<string, number>
  topProducts: Array<{ product: string; quantity: number }>
}

export default function SellerDashboard() {
  const [stats, setStats] = useState<SellerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")
    if (!token || !userData) return
    setUser(JSON.parse(userData))
    fetchStats(token)
  }, [])

  const fetchStats = async (token: string) => {
    try {
      const response = await fetch("/api/seller/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats || !user) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-muted rounded-2xl" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue, {user.firstName}. Voici un aperçu de votre boutique.
          </p>
        </div>
        <Link href="/seller/products/new">
          <Button className="shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau produit
          </Button>
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/seller/products">
          <StatCard
            label="Produits actifs"
            value={stats.activeProducts}
            sub={`sur ${stats.totalProducts} total`}
            icon={<Package className="w-6 h-6" />}
            iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          />
        </Link>
        <Link href="/seller/orders">
          <StatCard
            label="Commandes"
            value={stats.totalOrders}
            sub="total"
            icon={<ShoppingCart className="w-6 h-6" />}
            iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
        </Link>
        <Link href="/seller/orders">
          <StatCard
            label="Chiffre d'affaires"
            value={`${stats.totalRevenue.toLocaleString()} SLE`}
            sub="total cumulé"
            icon={<TrendingUp className="w-6 h-6" />}
            iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          />
        </Link>
        <Link href="/seller/orders">
          <StatCard
            label="En attente"
            value={stats.ordersByStatus.pending || 0}
            sub="commandes"
            icon={<Clock className="w-6 h-6" />}
            iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <Link href="/seller/products/new">
              <Button className="w-full justify-start" size="lg">
                <Plus className="h-5 w-5 mr-3" />
                Ajouter un nouveau produit
              </Button>
            </Link>
            <Link href="/seller/products">
              <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                <Package className="h-5 w-5 mr-3" />
                Gérer mes produits ({stats.totalProducts})
              </Button>
            </Link>
            <Link href="/seller/orders">
              <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                <ShoppingCart className="h-5 w-5 mr-3" />
                Voir les commandes ({stats.totalOrders})
              </Button>
            </Link>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Produits les plus vendus</h2>
          {stats.topProducts.length > 0 ? (
            <div className="space-y-3">
              {stats.topProducts.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    <span className="font-medium text-sm">{item.product}</span>
                  </div>
                  <Badge className="bg-primary">{item.quantity} vendus</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">Aucune vente pour le moment</p>
          )}
        </div>
      </div>

      {/* Order Status Overview */}
      {Object.keys(stats.ordersByStatus).length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <h2 className="text-lg font-bold mb-4">État des commandes</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="text-center p-4 bg-muted/50 rounded-xl">
                <p className="text-2xl font-bold text-primary">{count}</p>
                <p className="text-sm text-muted-foreground capitalize">{status}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  icon,
  iconBg,
}: {
  label: string
  value: string | number
  sub: string
  icon: React.ReactNode
  iconBg: string
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  )
}
