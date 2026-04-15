"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Plus } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const lowestPrice = Math.min(...product.priceTiers.map((tier) => tier.price))
  const highestPrice = Math.max(...product.priceTiers.map((tier) => tier.price))

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toast({
      title: "Bientot disponible",
      description: "Les favoris seront disponibles prochainement.",
    })
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1, lowestPrice)
    toast({
      title: "Produit ajoute",
      description: `${product.name} a ete ajoute au panier.`,
    })
  }

  return (
    <Link href={`/products/${product._id}`} className="group">
      <div className="bg-card rounded-2xl p-4 shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 flex flex-col h-full">
        {/* Image area */}
        <div className="relative h-48 bg-muted rounded-xl overflow-hidden mb-4 flex items-center justify-center">
          <Image
            src={product.images[0] || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Heart button */}
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 dark:bg-muted rounded-full flex items-center justify-center shadow-md text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Heart className="w-4 h-4" />
          </button>

          {/* Category badge */}
          <span className="absolute bottom-3 left-3 bg-white/90 dark:bg-black/50 backdrop-blur px-2 py-1 rounded-md text-xs font-semibold shadow-sm">
            {product.category}
          </span>
        </div>

        {/* Product info */}
        <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2 flex-1">{product.description}</p>

        {/* Price bar */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            {lowestPrice === highestPrice ? (
              <p className="text-lg font-bold text-primary">{lowestPrice.toLocaleString()} SLE</p>
            ) : (
              <div>
                <p className="text-xs text-muted-foreground">A partir de</p>
                <p className="text-lg font-bold text-primary">{lowestPrice.toLocaleString()} SLE</p>
              </div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  )
}
