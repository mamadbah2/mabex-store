"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/lib/cart-context"
import { CartItemComponent } from "@/components/cart-item"
import { ProductCard } from "@/components/product-card"
import { CheckoutStepper } from "@/components/checkout-stepper"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ShoppingBag, ArrowRight, Trash2, Lock, Tag } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function CartPage() {
  const { state, clearCart } = useCart()
  const { toast } = useToast()
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [promoCode, setPromoCode] = useState("")

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        const response = await fetch("/api/products")
        const data = await response.json()
        const products: Product[] = data.products || []
        const cartProductIds = state.items.map((i) => i.productId)
        const available = products.filter((p) => !cartProductIds.includes(p._id))
        const shuffled = available.sort(() => Math.random() - 0.5)
        setRecommendedProducts(shuffled.slice(0, 4))
      } catch (error) {
        console.error("Error fetching recommended products:", error)
      }
    }

    fetchRecommendedProducts()
  }, [state.items])

  const handleApplyPromo = () => {
    toast({
      title: "Bientot disponible",
      description: "Les codes promo seront disponibles prochainement.",
    })
  }

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Votre panier est vide</h1>
          <p className="text-muted-foreground mb-8">
            Decouvrez nos produits et ajoutez-les a votre panier.
          </p>
          <Link href="/">
            <Button className="rounded-xl font-bold shadow-lg shadow-primary/30 px-8 py-3">
              Continuer les achats
            </Button>
          </Link>
        </div>
      </div>
    )
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
            <BreadcrumbPage>Mon Panier</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Title + Clear cart */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold">
          Mon Panier{" "}
          <span className="text-xl font-medium text-muted-foreground ml-2">
            ({state.itemCount} article{state.itemCount > 1 ? "s" : ""})
          </span>
        </h1>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="text-primary font-medium hover:underline text-sm flex items-center gap-1">
              <Trash2 className="w-4 h-4" />
              Vider le panier
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Vider le panier ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action supprimera tous les articles de votre panier. Elle ne peut pas etre annulee.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={clearCart}>Confirmer</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: cart items */}
        <div className="lg:col-span-8 space-y-6">
          {state.items.map((item) => (
            <CartItemComponent key={item.productId} item={item} />
          ))}
        </div>

        {/* Right column: stepper + summary */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Stepper */}
          <CheckoutStepper activeStep={1} />

          {/* Order summary */}
          <div className="bg-card rounded-2xl p-6 sm:p-8 shadow-lg border border-border">
            <h2 className="text-xl font-bold mb-6">Resume de la commande</h2>

            <div className="space-y-4 mb-6">
              {/* Subtotal */}
              <div className="flex justify-between text-muted-foreground text-sm">
                <span>
                  Sous-total ({state.itemCount} article{state.itemCount > 1 ? "s" : ""})
                </span>
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

            {/* Promo code */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wide mb-2 text-muted-foreground">
                Code promo
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Entrez le code"
                    className="w-full pl-9 pr-4 py-2.5 border-none rounded-xl bg-muted text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-xl font-bold text-sm transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </div>

            {/* CTA button */}
            <Link href="/checkout">
              <Button className="w-full py-6 rounded-xl font-bold text-lg shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5">
                Passer la commande
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            {/* Security note */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex items-center justify-center gap-2 text-muted-foreground text-xs mb-3">
                <Lock className="w-4 h-4" />
                <span>Paiement securise a la livraison</span>
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Vous paierez lors de la reception de votre commande.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended products */}
      {recommendedProducts.length > 0 && (
        <section className="mt-16 bg-card rounded-3xl p-8 border border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold">Souvent achetes ensemble</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Les clients ayant achete ces articles ont aussi achete ceux-ci.
              </p>
            </div>
            <Link
              href="/products"
              className="text-primary font-semibold text-sm hover:underline flex items-center"
            >
              Voir tout <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
