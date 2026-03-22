# Mabex Store — Vue d'ensemble du projet

## Qu'est-ce que c'est ?

**Mabex** est une plateforme e-commerce B2B/B2C avec **prix dégressifs** (tarification par paliers de quantité). Elle cible le marché ouest-africain (Guinée) avec paiement à la livraison (**Cash on Delivery**). L'interface est entièrement en **français**.

## Stack technique

| Couche           | Technologie                                          |
| ---------------- | ---------------------------------------------------- |
| Framework        | **Next.js 15.2** (App Router)                        |
| Langage          | **TypeScript 5**                                     |
| UI Components    | **shadcn/ui** (style `new-york`) + **Radix UI**      |
| Styling          | **Tailwind CSS v4** (`@tailwindcss/postcss`) + oklch  |
| Icônes           | **Lucide React**                                     |
| Base de données  | **MongoDB Atlas** via **Mongoose 8**                 |
| Stockage images  | **Supabase Storage** (bucket `products-pictures`)    |
| Auth             | **JWT** (jsonwebtoken) + **bcryptjs** (localStorage) |
| Formulaires      | **react-hook-form** + **zod** (validation)           |
| Thème            | Jaune/doré primaire, blanc, support dark mode        |
| Font             | **Geist** (sans + mono)                              |

## Rôles utilisateurs

| Rôle       | Accès                                                               |
| ---------- | ------------------------------------------------------------------- |
| `customer` | Catalogue, panier, checkout, suivi commandes                        |
| `seller`   | Dashboard vendeur, CRUD produits, gestion commandes, stats          |
| `admin`    | Panel admin complet : utilisateurs, produits, commandes, statistiques |

## Modèle de prix dégressifs

Chaque produit a un tableau `priceTiers` :
```ts
priceTiers: [
  { minQuantity: 1,  maxQuantity: 9,   price: 80000 },
  { minQuantity: 10, maxQuantity: 49,  price: 70000 },
  { minQuantity: 50, maxQuantity: 299, price: 60000 },
  { minQuantity: 300,                  price: 50000 },
]
```
Le prix unitaire diminue à mesure que la quantité commandée augmente — modèle « du détail au gros ».

## Mode de paiement

**Paiement à la livraison uniquement** — aucune intégration de passerelle de paiement en ligne pour le moment.

## Commandes à connaître

```bash
npm run dev    # Lancer le serveur de dev Next.js
npm run build  # Build de production
npm run seed   # Initialiser la BDD avec des données test (tsx scripts/seed.ts)
```

## Credentials de seed

| Rôle     | Email                     | Mot de passe  |
| -------- | ------------------------- | ------------- |
| Admin    | admin@guineeshop.com      | admin123      |
| Vendeur  | vendeur@guineeshop.com    | vendeur123    |
| Client   | client@guineeshop.com     | client123     |
