"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { PriceCalculator } from "@/components/price-calculator"
import { ProductGrid } from "@/components/product-grid"
import {
  ShoppingCart,
  Heart,
  CheckCircle,
  Truck,
  ShieldCheck,
  CreditCard,
  User,
} from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [selectedPrice, setSelectedPrice] = useState(0)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        const productWithSeller: Product = {
          ...data.product._doc,
          seller: {
            id: data.product.seller._id,
            firstName: data.product.seller.firstName,
            lastName: data.product.seller.lastName,
          },
        }
        setProduct(productWithSeller)
        setSelectedPrice(data.product._doc.priceTiers[0].price)

        // Fetch related products
        fetchRelatedProducts(data.product._doc.category, id)
      } else {
        router.push("/")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      router.push("/")
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (
    category: string,
    currentId: string
  ) => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      const allProducts: Product[] = data.products || []
      const related = allProducts
        .filter((p) => p.category === category && p._id !== currentId)
        .slice(0, 4)
      setRelatedProducts(related)
    } catch (error) {
      console.error("Error fetching related products:", error)
    }
  }

  const handleQuantityChange = (quantity: number, price: number) => {
    setSelectedQuantity(quantity)
    setSelectedPrice(price)
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedQuantity, selectedPrice)
      toast({
        title: "Produit ajoute",
        description: `${product.name} a ete ajoute au panier.`,
      })
    }
  }

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, selectedQuantity, selectedPrice)
      router.push("/cart")
    }
  }

  const handleFavorite = () => {
    toast({
      title: "Bientot disponible",
      description: "Les favoris seront disponibles prochainement.",
    })
  }

  if (loading) {
    return (
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-5 w-64 bg-muted rounded animate-pulse mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-[4/3] bg-muted rounded-3xl animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 w-48 bg-muted rounded animate-pulse" />
              <div className="h-12 w-full bg-muted rounded animate-pulse" />
              <div className="h-48 bg-muted rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">
              Produit non trouve
            </p>
            <Button onClick={() => router.push("/")} className="rounded-xl">
              Retour a l'accueil
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
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
                <Link href="/products">Produits</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/products?category=${product.category}`}>
                  {product.category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Image Gallery */}
          <div>
            {/* Main image */}
            <div className="relative aspect-[4/3] bg-muted rounded-3xl overflow-hidden mb-4 p-6 flex items-center justify-center group">
              <Image
                src={
                  product.images[selectedImageIndex] ||
                  "/placeholder.svg?height=600&width=600"
                }
                alt={product.name}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />

              {/* Heart button */}
              <button
                onClick={handleFavorite}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 dark:bg-muted rounded-full flex items-center justify-center shadow-md text-muted-foreground hover:text-red-500 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </button>

              {/* Badges */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground shadow-sm">
                  {product.category}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/90 dark:bg-muted shadow-sm"
                >
                  {product.stock > 0 ? "En stock" : "Rupture"}
                </Badge>
              </div>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square relative overflow-hidden rounded-2xl bg-muted p-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-2 border-primary ring-2 ring-primary/20"
                        : "border border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Seller tag */}
            {product.seller && (
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-primary">
                {product.seller.firstName} {product.seller.lastName}
              </span>
            )}

            {/* Product name */}
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {product.name}
            </h1>

            {/* Short description */}
            <p className="text-muted-foreground text-lg leading-relaxed">
              {product.description}
            </p>

            {/* Price Calculator */}
            <PriceCalculator
              product={product}
              onQuantityChange={handleQuantityChange}
            />

            {/* Action buttons */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/30 py-6"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Ajouter au panier
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="flex-1 rounded-xl font-bold py-6"
                onClick={handleBuyNow}
              >
                Acheter maintenant
              </Button>
            </div>

            {/* Stock info */}
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {product.stock} articles disponibles
              </span>
            </div>
          </div>
        </div>

        {/* Tabs + Side info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start bg-muted/50 rounded-xl p-1">
                <TabsTrigger
                  value="description"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger
                  value="tarifs"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Tarifs degressifs
                </TabsTrigger>
                <TabsTrigger
                  value="vendeur"
                  className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  Vendeur
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="bg-card rounded-2xl border p-6">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="tarifs" className="mt-6">
                <div className="bg-card rounded-2xl border p-6">
                  <h3 className="font-bold text-lg mb-4">
                    Grille tarifaire
                  </h3>
                  <div className="overflow-hidden rounded-xl border">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left px-4 py-3 text-sm font-semibold">
                            Quantite
                          </th>
                          <th className="text-right px-4 py-3 text-sm font-semibold">
                            Prix unitaire
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.priceTiers.map((tier, index) => (
                          <tr
                            key={index}
                            className="border-t border-border"
                          >
                            <td className="px-4 py-3 text-sm">
                              {tier.minQuantity}
                              {tier.maxQuantity
                                ? ` - ${tier.maxQuantity}`
                                : "+"}{" "}
                              pieces
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-semibold text-primary">
                              {tier.price.toLocaleString()} SLE
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vendeur" className="mt-6">
                <div className="bg-card rounded-2xl border p-6">
                  {product.seller ? (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold">
                          {product.seller.firstName}{" "}
                          {product.seller.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Vendeur verifie
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      Informations vendeur non disponibles.
                    </p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Side info cards */}
          <div className="space-y-4">
            <div className="bg-card rounded-2xl border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold">Livraison</h3>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                  Livraison disponible
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
                  Suivi de commande
                </li>
              </ul>
            </div>

            <div className="bg-card rounded-2xl border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold">Paiement</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Paiement a la livraison uniquement. Aucun paiement en ligne
                requis.
              </p>
            </div>

            <div className="bg-card rounded-2xl border p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold">Garantie</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Produits de qualite verifiee. Retours acceptes sous conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">
              Vous pourriez aussi aimer
            </h2>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </div>
  )
}
