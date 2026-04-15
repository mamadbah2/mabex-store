import Link from "next/link"
import { Package } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Mabex</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Votre plateforme e-commerce de confiance avec des prix dégressifs selon la quantité. Découvrez nos
              produits de qualité et profitez de nos offres avantageuses.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                  Panier
                </Link>
              </li>
              <li>
                <Link href="/orders" className="text-muted-foreground hover:text-primary transition-colors">
                  Mes Commandes
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-muted-foreground">Email: support@guineeshop.com</span>
              </li>
              <li>
                <span className="text-muted-foreground">Téléphone: +224 123 456 789</span>
              </li>
              <li>
                <span className="text-muted-foreground">Paiement à la livraison uniquement</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 mt-8">
          <p className="text-center text-muted-foreground text-sm">© 2024 Mabex. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
