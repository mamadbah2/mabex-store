# Conventions et patterns du projet Mabex Store

## Langue

- **Interface utilisateur** : Tout est en **français** (labels, messages d'erreur, textes)
- **Code** : Noms de variables/fonctions en **anglais**, commentaires souvent en français
- **API responses** : Messages d'erreur en français (`"Email ou mot de passe incorrect"`)

## Patterns de code

### Pages (App Router)
- Toutes les pages sont des **client components** (`"use client"`)
- Pas de Server Components ni de Server Actions utilisés
- Auth vérifiée côté client via `localStorage` dans `useEffect()`
- Données chargées via `fetch()` vers les API Routes internes

### API Routes
```ts
// Pattern standard d'une API route protégée
export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "")
  if (!token) return NextResponse.json({ error: "..." }, { status: 401 })
  const session = await requireAuth(token) // ou requireRole(token, ['admin'])
  await connectDB()
  // ... logique métier
}
```

### Composants UI
- Utiliser les composants **shadcn/ui** depuis `@/components/ui/`
- Style `new-york` de shadcn/ui
- Icônes : **Lucide React** uniquement
- Layout responsive avec classes Tailwind (`grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)

### Gestion d'état
- **Panier** : `CartContext` via `useReducer` + persistance `localStorage`
- **Auth** : `localStorage` (`authToken` + `user`)
- **Données** : State local (`useState`) + `fetch()` dans `useEffect()`
- Pas de state management global (Redux, Zustand, etc.)

### Gestion des images produits
- Upload via Supabase Storage → bucket `products-pictures`
- Chemin : `sellers/{sellerId}/{timestamp}-{random}.{ext}`
- Limite : 5 MB max, images uniquement
- URL publique retournée après upload
- Images statiques de seed dans `/public/`

### Monnaie
- Les prix sont en **SLE** (Leone sierra-léonais) — affiché avec `toLocaleString()`
- Pas de symbole de devise dans le code, juste le label "SLE"
- Les prix de la mock data sont en valeurs type GNF (80000, 120000, etc.)

## Configuration Next.js

- ESLint et TypeScript errors **ignorés** pendant le build (`ignoreDuringBuilds`, `ignoreBuildErrors`)
- Images **non optimisées** (`unoptimized: true`)
- Alias de paths : `@/` → racine du projet (via `tsconfig.json`)

## Design System

- **Couleur primaire** : Jaune doré (`oklch(0.7 0.15 85)`)
- **Couleurs** : Système oklch avec CSS custom properties
- **Border radius** : `0.5rem` par défaut
- **Dark mode** : Supporté via classe `.dark` (non activé par défaut)

## Conventions de nommage

| Élément           | Convention            | Exemple                  |
| ----------------- | --------------------- | ------------------------ |
| Fichiers pages    | `page.tsx`            | `app/cart/page.tsx`      |
| Fichiers API      | `route.ts`            | `app/api/orders/route.ts`|
| Composants        | kebab-case fichier    | `product-card.tsx`       |
| Exports composant | PascalCase            | `ProductCard`            |
| Modèles Mongoose  | PascalCase            | `User`, `Product`        |
| Interfaces        | PascalCase avec I/Type| `IUser`, `UserType`      |
| Hooks             | camelCase avec `use`  | `useCart`, `useMobile`   |

## Points d'attention

> [!WARNING]
> - La connexion MongoDB URI est **hardcodée** dans `lib/mongodb.ts` (pas dans .env)
> - Le JWT_SECRET a une valeur par défaut en dur dans `lib/auth.ts`
> - `lib/mock-data.ts` existe encore mais n'est plus activement utilisé (les API routes utilisent MongoDB)
> - Pas de validation Zod côté API (uniquement `react-hook-form` côté client sur certains formulaires)
> - Pas de middleware Next.js pour la protection des routes
