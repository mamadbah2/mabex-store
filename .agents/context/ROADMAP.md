# État actuel & améliorations potentielles

## ✅ Ce qui fonctionne

- Catalogue produits avec recherche et filtrage par catégorie
- Système de prix dégressifs (price tiers)
- Panier avec persistance localStorage
- Auth complète (login, register, JWT)
- Checkout avec paiement à la livraison
- Dashboard vendeur avec stats et CRUD produits
- Panel admin complet (users, products, orders, stats)
- Upload d'images produits via Supabase
- Navigation responsive (mobile + desktop)
- Système de suivi de commandes (statuts multiples)

## ⚠️ Problèmes connus

1. **Sécurité** : MongoDB URI hardcodée dans `lib/mongodb.ts` (devrait être dans `.env`)
2. **Sécurité** : JWT_SECRET avec valeur par défaut en dur
3. **Auth** : Pas de middleware Next.js → les routes admin/seller ne sont protégées que côté client
4. **Données legacy** : `lib/mock-data.ts` est encore présent mais plus utilisé
5. **Validation** : Pas de validation Zod côté serveur (API routes)
6. **Monnaie** : Incohérence — le code affiche "SLE" mais les prix et the contexte (Guinée) suggèrent GNF

## 🚀 Améliorations possibles

### Priorité haute
- [ ] Déplacer le MongoDB URI dans `.env` et supprimer le hardcoding
- [ ] Ajouter un middleware Next.js pour protéger les routes `/admin/*` et `/seller/*`
- [ ] Ajouter la validation Zod côté API
- [ ] Supprimer `lib/mock-data.ts`

### Priorité moyenne
- [ ] Intégrer un système de paiement (Orange Money, Wave, etc.)
- [ ] Notifications par email (confirmation de commande, changement de statut)
- [ ] Système de recherche avancé (filtres prix, tri)
- [ ] Pagination côté serveur pour les listings
- [ ] Optimisation images Next.js (retirer `unoptimized: true`)

### Priorité basse
- [ ] Reviews/avis produits
- [ ] Système de favoris / wishlist
- [ ] Multi-langue (fr/en)
- [ ] PWA / notifications push
- [ ] Analytics dashboard amélioré (graphiques Recharts)
