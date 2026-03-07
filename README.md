# 🛍️ Mabex Store

Mabex Store est une plateforme e-commerce **B2B/B2C** complète, conçue pour gérer des ventes en ligne avec un système de prix dégressifs selon les quantités commandées. La plateforme supporte trois rôles distincts : **Client**, **Vendeur** et **Administrateur**.

---

## 🌟 Fonctionnalités

### 👤 Espace Client
- Parcourir et rechercher des produits
- Ajouter des articles au panier
- Passer des commandes avec suivi du statut
- Consulter l'historique des commandes

### 🏪 Espace Vendeur
- Tableau de bord avec statistiques de ventes
- Gestion des produits (création, modification, suppression)
- Suivi des commandes reçues
- Upload d'images de produits

### 🔧 Espace Administrateur
- Dashboard avec statistiques globales de la plateforme
- Gestion complète des utilisateurs (CRUD + attribution de rôles)
- Supervision de tous les produits et commandes
- Accès à tous les indicateurs clés (revenus, utilisateurs, commandes)

### 💰 Système de Prix Dégressifs
| Quantité | Tarif |
|----------|-------|
| 1 – 9 unités | Prix unitaire standard |
| 10 – 49 unités | Prix intermédiaire |
| 50 – 299 unités | Prix grossiste |
| 300+ unités | Prix gros volume |

---

## 🚀 Technologies Utilisées

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| [Next.js](https://nextjs.org/) | 15.2.8 | Framework React full-stack (App Router) |
| [React](https://react.dev/) | 18.3.1 | Bibliothèque UI |
| [TypeScript](https://www.typescriptlang.org/) | 5 | Typage statique |
| [Tailwind CSS](https://tailwindcss.com/) | 4.1.9 | Framework CSS utilitaire |
| [shadcn/ui](https://ui.shadcn.com/) | — | Composants UI accessibles et personnalisables |
| [Radix UI](https://www.radix-ui.com/) | — | Primitives d'UI accessibles |
| [Lucide React](https://lucide.dev/) | — | Bibliothèque d'icônes |
| [Recharts](https://recharts.org/) | 2.15.4 | Graphiques et visualisation de données |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.6 | Support du mode sombre |
| [Embla Carousel](https://www.embla-carousel.com/) | — | Carousel d'images |

### Backend & Base de données
| Technologie | Version | Description |
|-------------|---------|-------------|
| [MongoDB](https://www.mongodb.com/) | 6.18.0 | Base de données NoSQL |
| [Mongoose](https://mongoosejs.com/) | 8.17.1 | ODM pour MongoDB |
| [Supabase](https://supabase.com/) | 2.56.0 | Stockage des images produits |

### Authentification & Sécurité
| Technologie | Version | Description |
|-------------|---------|-------------|
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9.0.2 | Gestion des tokens JWT |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 3.0.2 | Hachage des mots de passe |

### Formulaires & Validation
| Technologie | Version | Description |
|-------------|---------|-------------|
| [React Hook Form](https://react-hook-form.com/) | 7.60.0 | Gestion des formulaires |
| [Zod](https://zod.dev/) | 3.25.67 | Validation de schémas TypeScript-first |
| [@hookform/resolvers](https://github.com/react-hook-form/resolvers) | 3.10.0 | Intégration Zod + React Hook Form |

### Utilitaires
| Technologie | Version | Description |
|-------------|---------|-------------|
| [date-fns](https://date-fns.org/) | 4.1.0 | Manipulation des dates |
| [sonner](https://sonner.emilkowal.ski/) | 1.7.4 | Notifications toast |
| [clsx](https://github.com/lukeed/clsx) | 2.1.1 | Gestion conditionnelle des classes CSS |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | 2.5.5 | Fusion intelligente des classes Tailwind |
| [vaul](https://vaul.emilkowal.ski/) | 0.9.9 | Composant drawer pour mobile |

---

## 📁 Structure du Projet

```
mabex-store/
├── app/
│   ├── api/                    # Routes API Next.js
│   │   ├── auth/               # Authentification (login, register, logout, me)
│   │   ├── products/           # Endpoints produits publics
│   │   ├── orders/             # Gestion des commandes clients
│   │   ├── seller/             # Routes vendeur (produits, commandes, stats)
│   │   └── admin/              # Routes admin (stats, utilisateurs, produits, commandes)
│   ├── admin/                  # Pages espace administrateur
│   ├── seller/                 # Pages tableau de bord vendeur
│   ├── products/               # Pages catalogue et détail produit
│   ├── orders/                 # Pages historique commandes
│   ├── cart/                   # Page panier
│   ├── checkout/               # Tunnel de commande
│   ├── login/                  # Page connexion
│   ├── register/               # Page inscription
│   └── page.tsx                # Page d'accueil
├── components/
│   ├── ui/                     # Composants shadcn/ui (40+ composants)
│   ├── admin/                  # Composants spécifiques à l'admin
│   ├── seller/                 # Composants spécifiques au vendeur
│   ├── header.tsx              # En-tête de navigation
│   ├── product-card.tsx        # Carte produit
│   ├── product-grid.tsx        # Grille de produits
│   └── order-status-badge.tsx  # Badge statut commande
├── lib/
│   ├── models.ts               # Schémas Mongoose (User, Product, Order)
│   ├── mongodb.ts              # Connexion MongoDB avec cache
│   ├── auth.ts                 # Logique d'authentification JWT
│   ├── supabase.ts             # Client Supabase pour le stockage
│   ├── types.ts                # Interfaces TypeScript
│   ├── utils.ts                # Fonctions utilitaires
│   └── cart-context.tsx        # Context React pour le panier
├── hooks/                      # Hooks React personnalisés
├── scripts/
│   └── seed.ts                 # Script de peuplement de la base de données
└── public/                     # Ressources statiques
```

---

## ⚙️ Installation & Démarrage

### Prérequis
- **Node.js** v18 ou supérieur
- **MongoDB** (local ou Atlas)
- **Supabase** (pour le stockage des images)

### 1. Cloner le dépôt

```bash
git clone https://github.com/mamadbah2/mabex-store.git
cd mabex-store
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>

# Supabase (pour les images)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your-secret-key
```

### 4. Peupler la base de données (optionnel)

```bash
npm run seed
```

Ce script crée des données de démonstration :
- **Admin** : admin@guineeshop.com / admin123
- **Vendeur** : vendeur@guineeshop.com / vendeur123
- **Client** : client@guineeshop.com / client123

### 5. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

---

## 📜 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Compile l'application pour la production |
| `npm run start` | Démarre le serveur de production |
| `npm run lint` | Analyse le code avec ESLint |
| `npm run seed` | Peuple la base de données avec des données de test |

---

## 🔌 API Routes

### Authentification
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/auth/login` | Connexion utilisateur |
| `POST` | `/api/auth/register` | Inscription utilisateur |
| `POST` | `/api/auth/logout` | Déconnexion |
| `GET` | `/api/auth/me` | Informations de l'utilisateur courant |

### Produits
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/products` | Liste tous les produits actifs |
| `GET/PUT/DELETE` | `/api/products/[id]` | Détail / modification / suppression d'un produit |

### Commandes
| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/orders` | Créer une commande |
| `GET` | `/api/orders/[id]` | Détail d'une commande |

### Espace Vendeur
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET/POST` | `/api/seller/products` | Produits du vendeur |
| `GET` | `/api/seller/orders` | Commandes du vendeur |
| `GET` | `/api/seller/stats` | Statistiques du vendeur |

### Espace Admin
| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/admin/stats` | Statistiques globales de la plateforme |
| `GET/POST` | `/api/admin/users` | Gestion des utilisateurs |
| `PUT` | `/api/admin/users/[id]` | Modifier un utilisateur |
| `GET` | `/api/admin/products` | Tous les produits |
| `GET/PUT/DELETE` | `/api/admin/products/[id]` | Gestion d'un produit |
| `GET` | `/api/admin/orders` | Toutes les commandes |

---

## 🎨 Thème & Design

L'interface utilise un thème clair/sombre basé sur des variables CSS personnalisées avec une palette de couleurs **dorée** comme couleur principale. La navigation et les composants sont entièrement responsive grâce à Tailwind CSS.

---

## 📚 Documentation Supplémentaire

- [Configuration Supabase](./SUPABASE_SETUP.md) – Mise en place du stockage d'images
- [Migration Admin](./ADMIN_MIGRATION.md) – Migration des routes admin vers MongoDB
- [Routes Produits Admin](./ADMIN_PRODUCTS_ROUTES.md) – Documentation des routes produits admin
- [Édition Utilisateur Admin](./ADMIN_USER_EDIT.md) – Page d'édition des utilisateurs

---

## 📄 Licence

Ce projet est à usage privé.
