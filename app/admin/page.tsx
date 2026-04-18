"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  XCircle,
  UserPlus,
  ArrowRight,
} from "lucide-react"
import type { Product } from "@/lib/types"

interface AdminStats {
  users: {
    total: number
    active: number
    sellers: number
    clients: number
    recent: number
    byRole: Record<string, number>
  }
  products: {
    total: number
    active: number
    recent: number
  }
  orders: {
    total: number
    recent: number
    byStatus: Record<string, number>
  }
  revenue: {
    total: number
  }
}

function getStockStatus(stock: number) {
  if (stock === 0)
    return {
      label: "Rupture",
      colorClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      dotClass: "bg-red-500",
    }
  if (stock <= 10)
    return {
      label: "Stock faible",
      colorClass: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      dotClass: "bg-yellow-500",
    }
  return {
    label: "En stock",
    colorClass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    dotClass: "bg-green-500",
  }
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")
    if (!token || !userData) return
    setUser(JSON.parse(userData))
    await Promise.all([fetchStats(token), fetchProducts(token)])
    setLoading(false)
  }

  const fetchStats = async (token: string) => {
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const fetchProducts = async (token: string) => {
    try {
      const res = await fetch("/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setRecentProducts((data.products || []).slice(0, 6))
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    const token = localStorage.getItem("authToken")
    if (!token) return
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      })
      if (res.ok) {
        setRecentProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, isActive: !currentStatus } : p))
        )
      }
    } catch (error) {
      console.error("Error toggling product:", error)
    }
  }

  const lowStockCount = recentProducts.filter((p) => p.stock > 0 && p.stock <= 10).length
  const outOfStockCount = recentProducts.filter((p) => p.stock === 0).length

  if (loading || !user) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-muted rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
          {/* Breadcrumb */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Administration</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Tableau de bord</h1>
              <p className="text-muted-foreground mt-1">
                Bienvenue, {user.firstName}. Voici un aperçu de la plateforme.
              </p>
            </div>
            <Link href="/admin/users/new">
              <Button className="shadow-lg shadow-primary/25">
                <UserPlus className="w-4 h-4 mr-2" />
                Nouveau vendeur
              </Button>
            </Link>
          </div>

          {/* 4 Main Stat Cards */}
          {stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                label="Utilisateurs actifs"
                value={stats.users.active}
                sub={`sur ${stats.users.total} total`}
                icon={<Users className="w-6 h-6" />}
                iconBg="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              />
              <StatCard
                label="Produits actifs"
                value={stats.products.active}
                sub={`sur ${stats.products.total} total`}
                icon={<Package className="w-6 h-6" />}
                iconBg="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
              />
              <StatCard
                label="Commandes"
                value={stats.orders.total}
                sub={`${stats.orders.recent} cette semaine`}
                icon={<ShoppingCart className="w-6 h-6" />}
                iconBg="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
              />
              <StatCard
                label="Chiffre d'affaires"
                value={`${stats.revenue.total.toLocaleString()} SLE`}
                sub="Total cumulé"
                icon={<TrendingUp className="w-6 h-6" />}
                iconBg="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
              />
            </div>
          )}

          {/* Recent Products Table */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Produits récents</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Package className="w-3.5 h-3.5" />
                    {stats?.products.total ?? 0} total
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {lowStockCount} stock faible
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
                    <XCircle className="w-3.5 h-3.5" />
                    {outOfStockCount} rupture
                  </span>
                </div>
              </div>
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  Tout gérer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                Aucun produit pour le moment
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-muted/50 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                        <th className="px-6 py-4">Produit</th>
                        <th className="px-6 py-4">Catégorie</th>
                        <th className="px-6 py-4">Prix min.</th>
                        <th className="px-6 py-4">Stock</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-sm">
                      {recentProducts.map((product) => {
                        const stockStatus = getStockStatus(product.stock)
                        const minPrice = Math.min(...product.priceTiers.map((t) => t.price))
                        return (
                          <tr
                            key={product._id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-lg bg-muted border border-border p-1.5 shrink-0 flex items-center justify-center">
                                  {product.images[0] ? (
                                    <img
                                      src={product.images[0]}
                                      alt={product.name}
                                      className="w-full h-full object-contain"
                                    />
                                  ) : (
                                    <Package className="w-6 h-6 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    ID: #{product._id.slice(-6)}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {product.category}
                            </td>
                            <td className="px-6 py-4 font-semibold">
                              {minPrice.toLocaleString()} SLE
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                              {product.stock} unités
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${stockStatus.colorClass}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${stockStatus.dotClass}`}
                                />
                                {stockStatus.label}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary hover:bg-primary/10 hover:text-primary font-medium"
                                  onClick={() =>
                                    toggleProductStatus(product._id, product.isActive)
                                  }
                                >
                                  {product.isActive ? "Désactiver" : "Activer"}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Affichage de{" "}
                    <span className="font-bold text-foreground">{recentProducts.length}</span> sur{" "}
                    <span className="font-bold text-foreground">
                      {stats?.products.total ?? 0}
                    </span>{" "}
                    produits
                  </span>
                  <Link href="/admin/products">
                    <Button variant="ghost" size="sm" className="text-primary">
                      Voir tous les produits
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Users + Orders breakdown */}
          {stats && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Users breakdown */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Répartition utilisateurs</h2>
                  <Link href="/admin/users">
                    <Button variant="ghost" size="sm" className="text-primary">
                      Gérer
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  <RoleRow
                    label="Clients"
                    count={stats.users.byRole.customer || 0}
                    color="bg-blue-500"
                  />
                  <RoleRow
                    label="Vendeurs"
                    count={stats.users.byRole.seller || 0}
                    color="bg-emerald-500"
                  />
                  <RoleRow
                    label="Administrateurs"
                    count={stats.users.byRole.admin || 0}
                    color="bg-purple-500"
                  />
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link href="/admin/users/new">
                    <Button size="sm" className="w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Créer un vendeur
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Orders by status */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Statut des commandes</h2>
                  <Link href="/admin/orders">
                    <Button variant="ghost" size="sm" className="text-primary">
                      Gérer
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-3">
                  {Object.entries(stats.orders.byStatus).map(([status, count]) => (
                    <div
                      key={status}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                    >
                      <span className="text-sm capitalize text-muted-foreground">{status}</span>
                      <Badge variant="outline">{count as number}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-bold text-foreground text-lg">
                      {stats.orders.recent}
                    </span>{" "}
                    nouvelles commandes cette semaine
                  </p>
                </div>
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
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
      >
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

function RoleRow({
  label,
  count,
  color,
}: {
  label: string
  count: number
  color: string
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="font-bold text-sm">{count}</span>
    </div>
  )
}
