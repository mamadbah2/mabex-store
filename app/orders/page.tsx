"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AccountSidebar } from "@/components/account-sidebar"
import { OrderStatusBadge } from "@/components/order-status-badge"
import { OrderProgressStepper } from "@/components/order-progress-stepper"
import { Search, Package, Eye, ArrowRight } from "lucide-react"
import type { Order, OrderItem, OrderStatus } from "@/lib/types"

interface OrderWithDetails extends Order {
  items: OrderItem[]
}

const STATUS_TABS: { label: string; value: OrderStatus | null }[] = [
  { label: "Toutes", value: null },
  { label: "En attente", value: "pending" },
  { label: "En préparation", value: "preparing" },
  { label: "Confirmées", value: "confirmed" },
]

const STATUS_MESSAGE: Record<OrderStatus, string> = {
  pending: "Votre commande a été reçue et est en attente de traitement.",
  preparing: "Nous préparons votre commande.",
  confirmed: "Votre commande a été confirmée.",
}

const ORDERS_PER_PAGE = 5

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithDetails[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [visibleCount, setVisibleCount] = useState(ORDERS_PER_PAGE)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    await fetchOrders(token)
  }

  const fetchOrders = async (token: string) => {
    try {
      const response = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort
  const filteredOrders = orders
    .filter((order) => {
      if (selectedStatus && order.status !== selectedStatus) return false
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matchesId = order.id.toLowerCase().includes(term)
        const matchesProduct = order.items.some((item) =>
          item.product?.name?.toLowerCase().includes(term)
        )
        return matchesId || matchesProduct
      }
      return true
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const visibleOrders = filteredOrders.slice(0, visibleCount)
  const hasMore = visibleCount < filteredOrders.length

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar skeleton */}
            <div className="lg:w-72 shrink-0">
              <div className="bg-card rounded-2xl border border-border p-6 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-muted mb-3" />
                  <div className="h-5 w-32 bg-muted rounded mb-2" />
                  <div className="h-4 w-40 bg-muted rounded" />
                </div>
                <div className="mt-6 space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-muted rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
            {/* Content skeleton */}
            <div className="flex-1 min-w-0 space-y-6">
              <div className="h-8 w-64 bg-muted rounded" />
              <div className="h-12 bg-muted rounded-xl" />
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 w-28 bg-muted rounded" />
                ))}
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-6 animate-pulse">
                  <div className="h-6 w-48 bg-muted rounded mb-4" />
                  <div className="h-20 bg-muted rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-72 shrink-0">
            <AccountSidebar activePage="orders" user={user} />
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-3xl font-bold">Historique des commandes</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Consultez le statut de vos commandes récentes.
                </p>
              </div>
              <div className="w-full sm:w-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par ID ou produit..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setVisibleCount(ORDERS_PER_PAGE)
                  }}
                  className="pl-10 sm:w-64 rounded-xl"
                />
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-8 border-b border-border pb-1 no-scrollbar">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.label}
                  onClick={() => {
                    setSelectedStatus(tab.value)
                    setVisibleCount(ORDERS_PER_PAGE)
                  }}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedStatus === tab.value
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg mb-4">
                    {orders.length === 0
                      ? "Aucune commande pour le moment"
                      : "Aucune commande trouvée"}
                  </p>
                  {orders.length === 0 && (
                    <Link href="/">
                      <Button>Découvrir nos produits</Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {visibleOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}

            {/* Load More */}
            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  className="rounded-xl px-6"
                  onClick={() => setVisibleCount((c) => c + ORDERS_PER_PAGE)}
                >
                  Charger plus de commandes
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function OrderCard({ order }: { order: OrderWithDetails }) {
  const orderDate = new Date(order.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const firstProductName = order.items[0]?.product?.name || "Produit"
  const otherCount = order.items.length - 1
  const displayName =
    otherCount > 0 ? `${firstProductName} & ${otherCount} autre${otherCount > 1 ? "s" : ""}` : firstProductName

  return (
    <Card className="rounded-2xl overflow-hidden">
      {/* Card Header */}
      <div className="p-4 sm:p-6 border-b border-border bg-muted/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Date de commande
            </p>
            <p className="text-sm font-medium">{orderDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              Montant total
            </p>
            <p className="text-sm font-medium">{order.totalAmount.toLocaleString()} SLE</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
              N° de commande
            </p>
            <p className="text-sm font-medium">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href={`/orders/${order.id}`} className="flex-1 md:flex-none">
            <Button variant="outline" size="sm" className="w-full rounded-lg">
              <Eye className="w-4 h-4 mr-2" />
              Voir les détails
            </Button>
          </Link>
        </div>
      </div>

      {/* Card Body */}
      <CardContent className="p-4 sm:p-6">
        {/* Status + Stepper */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold flex items-center gap-2">
                <OrderStatusBadge status={order.status} />
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {STATUS_MESSAGE[order.status]}
              </p>
            </div>
          </div>
          <OrderProgressStepper status={order.status} />
        </div>

        {/* Product info */}
        <div className="flex flex-col sm:flex-row gap-6 border-t border-border pt-6">
          {/* Product thumbnails */}
          <div className="flex -space-x-4 overflow-hidden py-2 px-2">
            {order.items.slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="relative w-16 h-16 rounded-xl border-2 border-card bg-muted flex items-center justify-center overflow-hidden shadow-sm"
              >
                {item.product?.images?.[0] ? (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name || "Produit"}
                    className="w-full h-full object-contain p-2"
                  />
                ) : (
                  <Package className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
          <div className="flex-1">
            <h4 className="font-medium mb-1">{displayName}</h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {order.items[0]?.product?.description || ""}
            </p>
          </div>
          <div className="flex items-center">
            <Link
              href={`/orders/${order.id}`}
              className="text-primary font-medium text-sm hover:underline flex items-center gap-1"
            >
              Voir les détails
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
