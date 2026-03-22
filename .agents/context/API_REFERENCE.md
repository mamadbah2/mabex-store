# Référence API — Mabex Store

Toutes les routes sont dans `app/api/`. Auth via header `Authorization: Bearer <token>`.

## Auth (`/api/auth/`)

| Méthode | Route               | Auth | Description                                |
| ------- | -------------------- | ---- | ------------------------------------------ |
| POST    | `/api/auth/login`    | ❌   | Connexion → retourne `{ user, token }`     |
| POST    | `/api/auth/register` | ❌   | Inscription (rôle `customer`) + auto-login |
| POST    | `/api/auth/logout`   | ✅   | Déconnexion (noop côté serveur)            |
| GET     | `/api/auth/me`       | ✅   | Retourne le user courant depuis le JWT     |

## Produits (`/api/products/`)

| Méthode | Route                  | Auth | Description                |
| ------- | ---------------------- | ---- | -------------------------- |
| GET     | `/api/products`        | ❌   | Liste produits actifs      |
| GET     | `/api/products/[id]`   | ❌   | Détail d'un produit par ID |

## Commandes (`/api/orders/`)

| Méthode | Route              | Auth | Description                                      |
| ------- | ------------------- | ---- | ------------------------------------------------ |
| POST    | `/api/orders`       | ✅   | Créer une commande (valide stock, calcule prix)  |
| GET     | `/api/orders`       | ✅   | Liste commandes du user authentifié              |
| GET     | `/api/orders/[id]`  | ✅   | Détail d'une commande                            |
| PATCH   | `/api/orders/[id]`  | ✅   | Mettre à jour le statut d'une commande           |

## Admin (`/api/admin/`) — Requiert rôle `admin`

| Méthode | Route                    | Description                        |
| ------- | ------------------------- | ---------------------------------- |
| GET     | `/api/admin/stats`        | Stats globales (users, products, orders, revenue) |
| GET     | `/api/admin/users`        | Liste tous les utilisateurs        |
| POST    | `/api/admin/users`        | Créer un utilisateur (seller/admin)|
| GET     | `/api/admin/users/[id]`   | Détail utilisateur                 |
| PATCH   | `/api/admin/users/[id]`   | Modifier utilisateur (rôle, status)|
| DELETE  | `/api/admin/users/[id]`   | Supprimer/désactiver utilisateur   |
| GET     | `/api/admin/products`     | Liste tous les produits            |
| PATCH   | `/api/admin/products/[id]`| Modifier un produit (activation)   |
| GET     | `/api/admin/orders`       | Liste toutes les commandes         |

## Seller (`/api/seller/`) — Requiert rôle `seller`

| Méthode | Route                      | Description                          |
| ------- | --------------------------- | ------------------------------------ |
| GET     | `/api/seller/stats`         | Stats du vendeur (ses produits/commandes) |
| GET     | `/api/seller/products`      | Liste produits du vendeur            |
| POST    | `/api/seller/products`      | Créer un produit                     |
| GET     | `/api/seller/products/[id]` | Détail d'un de ses produits          |
| PATCH   | `/api/seller/products/[id]` | Modifier un produit                  |
| DELETE  | `/api/seller/products/[id]` | Supprimer un produit                 |
| GET     | `/api/seller/orders`        | Commandes contenant ses produits     |

## Pages frontend

| Route                         | Description                     | Rôle requis |
| ----------------------------- | ------------------------------- | ----------- |
| `/`                           | Catalogue produits (homepage)   | Tous        |
| `/products/[id]`              | Détail produit                  | Tous        |
| `/cart`                        | Panier                         | Tous        |
| `/checkout`                    | Finalisation commande          | customer+   |
| `/login`                       | Page de connexion              | Tous        |
| `/register`                    | Page d'inscription             | Tous        |
| `/orders`                      | Mes commandes                  | customer+   |
| `/orders/[id]`                 | Détail commande                | customer+   |
| `/order-confirmation/[id]`     | Confirmation commande          | customer+   |
| `/seller`                      | Dashboard vendeur              | seller      |
| `/seller/products`             | Mes produits                   | seller      |
| `/seller/products/new`         | Ajouter produit                | seller      |
| `/seller/products/[id]/edit`   | Modifier produit               | seller      |
| `/seller/orders`               | Commandes vendeur              | seller      |
| `/admin`                       | Dashboard admin                | admin       |
| `/admin/users`                 | Gestion utilisateurs           | admin       |
| `/admin/users/new`             | Créer utilisateur              | admin       |
| `/admin/users/[id]/details`    | Détails utilisateur            | admin       |
| `/admin/users/[id]/edit`       | Modifier utilisateur           | admin       |
| `/admin/products`              | Gestion produits               | admin       |
| `/admin/orders`                | Gestion commandes              | admin       |
