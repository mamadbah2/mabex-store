"use client"

import Image from "next/image"
import { Trash2, Plus, Minus, Heart, CheckCircle, Clock } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import { calculateProductPrice } from "@/lib/utils"
import type { CartItem } from "@/lib/types"

interface CartItemProps {
  item: CartItem
}

export function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const { toast } = useToast()

  const handleQuantityChange = (newQuantity: number) => {
    if (!item.product) return

    const maxQuantity = item.product.stock
    const validQuantity = Math.max(1, Math.min(maxQuantity, newQuantity))
    const newPrice = calculateProductPrice(item.product, validQuantity)
    updateQuantity(item.productId, validQuantity, newPrice)
  }

  const handleRemove = () => {
    removeFromCart(item.productId)
  }

  const handleSave = () => {
    toast({
      title: "Bientot disponible",
      description: "Les favoris seront disponibles prochainement.",
    })
  }

  if (!item.product) {
    return null
  }

  const lineTotal = item.quantity * item.selectedPrice

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border/50 flex flex-col sm:flex-row gap-6 transition-all hover:shadow-md group">
      {/* Product image */}
      <div className="w-full sm:w-40 h-40 bg-muted rounded-xl flex-shrink-0 flex items-center justify-center p-4 border border-border overflow-hidden">
        <Image
          src={item.product.images[0] || "/placeholder.svg?height=160&width=160"}
          alt={item.product.name}
          width={160}
          height={160}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Top row: info left + price right */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold">{item.product.name}</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                {item.product.category}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium mt-1">
              {item.product.stock > 10 ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">En stock</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-orange-500">Stock faible</span>
                </>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="block text-2xl font-extrabold tracking-tight">
              {lineTotal.toLocaleString()} SLE
            </span>
            {item.quantity > 1 && (
              <span className="text-xs text-muted-foreground">
                {item.selectedPrice.toLocaleString()} SLE / unite
              </span>
            )}
          </div>
        </div>

        {/* Bottom bar: quantity + actions */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mt-6 gap-4 border-t border-border pt-4">
          <div className="flex items-center gap-6">
            {/* Quantity controls */}
            <div className="flex items-center border border-border rounded-lg bg-muted/50 h-10">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted rounded-l-lg transition-colors disabled:opacity-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                max={item.product.stock}
                value={item.quantity}
                onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                className="w-12 h-full text-center text-sm font-semibold bg-transparent border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.product.stock}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted rounded-r-lg transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Save button */}
            <button
              onClick={handleSave}
              className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Sauvegarder</span>
            </button>

            {/* Remove button */}
            <button
              onClick={handleRemove}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors font-medium flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Supprimer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
