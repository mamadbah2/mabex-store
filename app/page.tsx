"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, TrendingUp, ShieldCheck } from "lucide-react"
import type { Product } from "@/lib/types"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products
    if (selectedCategory) {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }
    setFilteredProducts(filtered)
  }

  const categories = Array.from(new Set(products.map((product) => product.category)))

  if (loading) {
    return (
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2 h-[360px] bg-muted rounded-3xl animate-pulse" />
            <div className="hidden md:flex flex-col gap-6">
              <div className="h-[168px] bg-muted rounded-2xl animate-pulse" />
              <div className="h-[168px] bg-muted rounded-2xl animate-pulse" />
            </div>
          </div>
          {/* Grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[340px] bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Main hero card */}
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-8 md:p-12 flex flex-col justify-end min-h-[320px] md:min-h-[360px]">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/3" />

            <div className="relative z-10">
              <span className="inline-block bg-white/20 backdrop-blur text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                Prix degressifs
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                Decouvrez Notre Collection Premium
              </h1>
              <p className="text-white/80 text-base md:text-lg mb-6 max-w-lg">
                Des prix degressifs selon vos quantites — du detail au gros, trouvez les meilleurs tarifs.
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl shadow-lg">
                  Voir les Produits
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right side cards */}
          <div className="hidden md:flex flex-col gap-6">
            <div className="flex-1 relative overflow-hidden rounded-2xl bg-card border border-border p-6 flex flex-col justify-between">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Prix Degressifs</h3>
                <p className="text-muted-foreground text-sm">Plus vous commandez, moins vous payez par unite.</p>
              </div>
            </div>
            <div className="flex-1 relative overflow-hidden rounded-2xl bg-card border border-border p-6 flex flex-col justify-between">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Paiement Securise</h3>
                <p className="text-muted-foreground text-sm">Paiement a la livraison. Aucun paiement en ligne requis.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Category filter buttons */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-card border border-border text-foreground hover:border-primary/50"
            }`}
          >
            Tous
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card border border-border text-foreground hover:border-primary/50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Popular Products Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold">Populaire maintenant</h2>
            <Link
              href="/products"
              className="text-primary hover:text-primary/80 font-semibold text-sm flex items-center gap-1"
            >
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={filteredProducts.slice(0, 8)} columns={4} />
        </div>

        {/* Promotional Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-12 mb-8">
          {/* Decorative blur */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-6 h-6 text-primary" />
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Mabex Store</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Essentiel au Quotidien</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                Achetez en gros et economisez. Notre systeme de prix degressifs vous permet d'obtenir les meilleurs
                tarifs selon vos quantites.
              </p>
              <Link href="/products">
                <Button className="rounded-xl font-bold shadow-lg shadow-primary/30">
                  Voir la Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="hidden md:grid grid-cols-2 gap-4">
              {products.slice(0, 4).map((p) => (
                <div
                  key={p._id}
                  className="w-28 h-28 bg-muted rounded-2xl overflow-hidden relative"
                >
                  <img
                    src={p.images[0] || "/placeholder.svg?height=112&width=112"}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
