"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { AccountSidebar } from "@/components/account-sidebar"
import { OrderStatusBadge } from "@/components/order-status-badge"
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Package,
  Heart,
  ArrowRight,
  ShoppingBag,
} from "lucide-react"
import type { Order, OrderItem } from "@/lib/types"

interface OrderWithDetails extends Order {
  items: OrderItem[]
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState<OrderWithDetails[]>([])
  const [loading, setLoading] = useState(true)

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
    await fetchRecentOrders(token)
    setLoading(false)
  }

  const fetchRecentOrders = async (token: string) => {
    try {
      const response = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        const orders: OrderWithDetails[] = data.orders || []
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setRecentOrders(orders.slice(0, 3))
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar skeleton */}
            <div className="lg:col-span-3">
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
            <div className="lg:col-span-9 space-y-6">
              <div className="h-8 w-48 bg-muted rounded" />
              <div className="bg-card rounded-2xl border border-border p-6 animate-pulse">
                <div className="h-6 w-56 bg-muted rounded mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-muted rounded-xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Mon Compte</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Mon Compte</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre profil, vos commandes et vos préférences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <AccountSidebar activePage="profile" user={user} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Personal Information */}
            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Informations personnelles</CardTitle>
                <Button variant="outline" size="sm" disabled title="Bientôt disponible">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoField
                    icon={<User className="w-5 h-5 text-muted-foreground" />}
                    label="Nom complet"
                    value={`${user.firstName} ${user.lastName}`}
                  />
                  <InfoField
                    icon={<Mail className="w-5 h-5 text-muted-foreground" />}
                    label="Email"
                    value={user.email}
                  />
                  <InfoField
                    icon={<Phone className="w-5 h-5 text-muted-foreground" />}
                    label="Téléphone"
                    value={user.phone || "Non renseigné"}
                  />
                  <InfoField
                    icon={<Calendar className="w-5 h-5 text-muted-foreground" />}
                    label="Date de naissance"
                    value="Non renseigné"
                    badge="Bientôt"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Adresse de livraison</CardTitle>
                  <Button variant="ghost" size="sm" disabled title="Bientôt disponible">
                    <Edit className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      {user.address || "Non renseignée"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Adresse de facturation</CardTitle>
                  <Badge variant="outline" className="text-[10px]">Bientôt</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground/50">
                      Bientôt disponible
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Commandes récentes</CardTitle>
                <Link href="/orders">
                  <Button variant="ghost" size="sm" className="text-primary">
                    Voir tout
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">Aucune commande pour le moment</p>
                    <Link href="/">
                      <Button size="sm">Découvrir nos produits</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-muted/30 rounded-xl gap-4"
                      >
                        <div className="flex items-center gap-4">
                          {/* Product thumbnails */}
                          <div className="flex -space-x-3">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div
                                key={idx}
                                className="w-12 h-12 rounded-lg border-2 border-card bg-muted flex items-center justify-center overflow-hidden"
                              >
                                {item.product?.images?.[0] ? (
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.name || "Produit"}
                                    className="w-full h-full object-contain p-1"
                                  />
                                ) : (
                                  <Package className="w-5 h-5 text-muted-foreground" />
                                )}
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="w-12 h-12 rounded-lg border-2 border-card bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                +{order.items.length - 2}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm">
                              Commande #{order.id.slice(-8)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <OrderStatusBadge status={order.status} />
                          <span className="font-bold text-sm">
                            {order.totalAmount.toLocaleString()} SLE
                          </span>
                          <Link href={`/orders/${order.id}`}>
                            <Button variant="ghost" size="sm" className="text-primary">
                              Détails
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Saved Items / Wishlist */}
            <Card className="rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Articles sauvegardés
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">Bientôt</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="text-muted-foreground mb-4">
                    La wishlist sera bientôt disponible
                  </p>
                  <Link href="/products">
                    <Button variant="outline" size="sm">
                      Découvrir nos produits
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoField({
  icon,
  label,
  value,
  badge,
}: {
  icon: React.ReactNode
  label: string
  value: string
  badge?: string
}) {
  return (
    <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <p className={`text-sm font-medium ${value === "Non renseigné" ? "text-muted-foreground" : ""}`}>
            {value}
          </p>
          {badge && (
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {badge}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
