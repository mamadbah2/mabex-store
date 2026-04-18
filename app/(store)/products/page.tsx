"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { ProductGrid } from "@/components/product-grid"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { SlidersHorizontal, X, LayoutGrid } from "lucide-react"
import type { Product } from "@/lib/types"

const PRODUCTS_PER_PAGE = 9

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0])
  const [maxPriceLimit, setMaxPriceLimit] = useState(0)
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      const fetched: Product[] = data.products || []
      setProducts(fetched)

      if (fetched.length > 0) {
        const maxPrice = Math.max(
          ...fetched.map((p) => Math.max(...p.priceTiers.map((t) => t.price)))
        )
        setMaxPriceLimit(maxPrice)
        setPriceRange([0, maxPrice])
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  )

  const filteredProducts = useMemo(() => {
    let result = products

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category))
    }

    if (maxPriceLimit > 0) {
      result = result.filter((p) => {
        const lowestPrice = Math.min(...p.priceTiers.map((t) => t.price))
        return lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1]
      })
    }

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort(
          (a, b) =>
            Math.min(...a.priceTiers.map((t) => t.price)) -
            Math.min(...b.priceTiers.map((t) => t.price))
        )
        break
      case "price-desc":
        result = [...result].sort(
          (a, b) =>
            Math.min(...b.priceTiers.map((t) => t.price)) -
            Math.min(...a.priceTiers.map((t) => t.price))
        )
        break
      case "newest":
        result = [...result].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        break
    }

    return result
  }, [products, selectedCategories, priceRange, sortBy, maxPriceLimit])

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategories, priceRange, sortBy])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setPriceRange([0, maxPriceLimit])
  }

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    (maxPriceLimit > 0 && (priceRange[0] > 0 || priceRange[1] < maxPriceLimit))

  // Sidebar filter content (shared between desktop and mobile)
  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
          Categories
        </h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <Checkbox
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                {category}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                {products.filter((p) => p.category === category).length}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      {maxPriceLimit > 0 && (
        <div>
          <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
            Fourchette de prix
          </h3>
          <Slider
            min={0}
            max={maxPriceLimit}
            step={Math.max(1, Math.floor(maxPriceLimit / 100))}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{priceRange[0].toLocaleString()} SLE</span>
            <span>{priceRange[1].toLocaleString()} SLE</span>
          </div>
        </div>
      )}

      {/* Promo card */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5">
        <p className="text-primary font-bold text-sm mb-1">Prix degressifs</p>
        <p className="text-muted-foreground text-xs">
          Plus vous commandez, moins vous payez par unite.
        </p>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-6 w-48 bg-muted rounded animate-pulse mb-8" />
          <div className="flex gap-8">
            <div className="hidden lg:block w-72 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-muted rounded-2xl animate-pulse"
                />
              ))}
            </div>
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[340px] bg-muted rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Accueil</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Produits</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <h2 className="font-bold text-lg mb-6">Filtres</h2>
              <FilterContent />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Tous les Produits
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {filteredProducts.length} produit
                  {filteredProducts.length !== 1 ? "s" : ""} trouve
                  {filteredProducts.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden rounded-xl"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] rounded-xl">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Populaire</SelectItem>
                    <SelectItem value="price-asc">Prix croissant</SelectItem>
                    <SelectItem value="price-desc">Prix decroissant</SelectItem>
                    <SelectItem value="newest">Plus recents</SelectItem>
                  </SelectContent>
                </Select>
                {/* View icon (visual only) */}
                <div className="hidden sm:flex items-center gap-1">
                  <button className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filter pills */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {selectedCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {cat}
                    <X className="w-3.5 h-3.5" />
                  </button>
                ))}
                {maxPriceLimit > 0 &&
                  (priceRange[0] > 0 || priceRange[1] < maxPriceLimit) && (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {priceRange[0].toLocaleString()} -{" "}
                      {priceRange[1].toLocaleString()} SLE
                      <button
                        onClick={() => setPriceRange([0, maxPriceLimit])}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  )}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-muted-foreground hover:text-foreground underline ml-2"
                >
                  Tout effacer
                </button>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid products={paginatedProducts} columns={3} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-10">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter((page) => {
                        if (totalPages <= 7) return true
                        if (page === 1 || page === totalPages) return true
                        if (Math.abs(page - currentPage) <= 1) return true
                        return false
                      })
                      .map((page, idx, arr) => {
                        const showEllipsis =
                          idx > 0 && page - arr[idx - 1] > 1
                        return (
                          <span key={page} className="contents">
                            {showEllipsis && (
                              <PaginationItem>
                                <span className="px-2 text-muted-foreground">
                                  ...
                                </span>
                              </PaginationItem>
                            )}
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => setCurrentPage(page)}
                                isActive={currentPage === page}
                                className={`cursor-pointer rounded-xl ${
                                  currentPage === page
                                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                                    : ""
                                }`}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          </span>
                        )
                      })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filters Sheet */}
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetContent side="left" className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtres</SheetTitle>
              <SheetDescription>
                Affinez votre recherche de produits
              </SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
