import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Product } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateProductPrice(product: Product, quantity: number): number {
  const tier = product.priceTiers.find(
    (tier) => quantity >= tier.minQuantity && (tier.maxQuantity === undefined || quantity <= tier.maxQuantity),
  )
  return tier?.price || product.priceTiers[0].price
}
