"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { CheckoutStepper } from "@/components/checkout-stepper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { User, MapPin, ArrowRight, Lock } from "lucide-react"

export default function CheckoutPage() {
  const { state, clearCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showAuthForm, setShowAuthForm] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")

  // Auth form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      setIsAuthenticated(true)
    } else {
      setShowAuthForm(true)
    }
  }, [])

  useEffect(() => {
    if (state.items.length === 0) {
      router.push("/cart")
    }
  }, [state.items, router])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register"
      const body =
        authMode === "login" ? { email, password } : { email, password, firstName, lastName, phone: phone || undefined }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("authToken", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        setIsAuthenticated(true)
        setShowAuthForm(false)
      } else {
        alert(data.error || "Erreur d'authentification")
      }
    } catch (error) {
      console.error("Auth error:", error)
      alert("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: state.items,
          shippingAddress,
          phone,
          notes,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        clearCart()
        router.push(`/order-confirmation/${data.order.id}`)
      } else {
        alert(data.error || "Erreur lors de la creation de la commande")
        if (data.error === "Authentification requise") {
          setShowAuthForm(true)
        }
      }
    } catch (error) {
      console.error("Order error:", error)
      alert("Erreur de connexion")
    } finally {
      setLoading(false)
    }
  }

  if (state.items.length === 0) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Accueil</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/cart">Panier</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Livraison</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* Authentication Form */}
          {showAuthForm && (
            <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {authMode === "login" ? "Connexion" : "Creer un compte"}
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleAuth} className="space-y-4">
                  {authMode === "register" && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Prenom</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="rounded-xl mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="rounded-xl mt-1"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="rounded-xl mt-1"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl font-bold shadow-lg shadow-primary/30 py-3"
                    disabled={loading}
                  >
                    {loading ? "Chargement..." : authMode === "login" ? "Se connecter" : "Creer le compte"}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      {authMode === "login" ? "Creer un compte" : "Deja un compte ? Se connecter"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Shipping Form */}
          {isAuthenticated && (
            <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
              <div className="p-6 border-b border-border">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Informations de livraison
                </h2>
              </div>
              <div className="p-6">
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div>
                    <Label htmlFor="shippingAddress">Adresse de livraison</Label>
                    <Textarea
                      id="shippingAddress"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="Votre adresse complete de livraison"
                      className="rounded-xl mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telephone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+224 XXX XXX XXX"
                      className="rounded-xl mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes (optionnel)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Instructions speciales pour la livraison"
                      className="rounded-xl mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl font-bold text-lg py-6 shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
                    disabled={loading}
                  >
                    {loading ? "Traitement..." : "Confirmer la commande"}
                    {!loading && <ArrowRight className="w-5 h-5 ml-2" />}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Right column: stepper + order summary */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Stepper */}
          <CheckoutStepper activeStep={2} />

          {/* Order summary */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-border">
            <h2 className="text-xl font-bold mb-6">Resume de la commande</h2>

            {/* Order items (compact) */}
            <div className="space-y-3 mb-6">
              {state.items.map((item) => (
                <div key={item.productId} className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product?.images[0] || "/placeholder.svg?height=48&width=48"}
                      alt={item.product?.name || ""}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{item.product?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x {item.selectedPrice.toLocaleString()} SLE
                    </p>
                  </div>
                  <p className="font-semibold text-sm">
                    {(item.quantity * item.selectedPrice).toLocaleString()} SLE
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Sous-total</span>
                <span className="font-semibold text-foreground">{state.total.toLocaleString()} SLE</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>Livraison</span>
                <span className="font-semibold text-primary">Gratuite</span>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-dashed border-border">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-3xl font-extrabold text-primary">
                    {state.total.toLocaleString()} SLE
                  </span>
                </div>
                <p className="text-xs text-right text-muted-foreground">Devise: SLE</p>
              </div>
            </div>

            {/* Payment note */}
            <div className="mt-6 bg-muted/50 rounded-lg p-3">
              <p className="text-sm font-semibold mb-1">Paiement a la livraison</p>
              <p className="text-xs text-muted-foreground">
                Vous paierez {state.total.toLocaleString()} SLE lors de la reception de votre commande.
              </p>
            </div>

            {/* Security */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs">
                <Lock className="w-4 h-4" />
                <span>Paiement securise a la livraison</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
