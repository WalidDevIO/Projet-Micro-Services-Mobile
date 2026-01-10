# Bruno Collection - Micro-Services E-Commerce

Collection de requêtes Bruno pour tester les APIs AuthAPI et EcommAPI.

## 📁 Structure

```
bruno-collection/
├── Auth/                   # API d'authentification
│   ├── 1. Signup (First Admin).bru
│   ├── 2. Signup (Regular User).bru
│   ├── 3. Signin (Admin).bru
│   ├── 4. Signin (User).bru
│   ├── 5. Check Token (Admin).bru
│   ├── 6. Check Token (User).bru
│   └── 7. Logout.bru
├── Ecomm/                  # API E-Commerce
│   ├── Categories/         # Routes publiques catégories
│   │   ├── 1. Get All Categories (Public).bru
│   │   └── 2. Get Category By ID (Public).bru
│   ├── Articles/           # Routes publiques articles
│   │   ├── 1. Get All Articles (Public).bru
│   │   ├── 2. Get Articles By Category (Public).bru
│   │   └── 3. Get Article By ID (Public).bru
│   ├── Cart/               # Panier utilisateur
│   │   ├── 1. Get My Cart.bru
│   │   ├── 2. Add Item to Cart.bru
│   │   ├── 3. Update Cart Item Quantity.bru
│   │   ├── 4. Remove Item from Cart.bru
│   │   └── 5. Clear Cart.bru
│   └── Admin/              # Routes admin
│       ├── Categories/
│       │   ├── 1. Create Category (Admin).bru
│       │   ├── 2. Update Category (Admin).bru
│       │   └── 3. Delete Category (Admin).bru
│       └── Articles/
│           ├── 1. Create Article (Admin).bru
│           ├── 2. Update Article (Admin).bru
│           └── 3. Delete Article (Admin).bru
└── environments/
    └── Local.bru           # Variables d'environnement
```

## 🚀 Configuration

### Prérequis
Lancer la stack Docker :
   ```bash
   docker compose up -d --build
   ```

### Variables d'environnement
Les variables suivantes sont définies dans `environments/Local.bru` :

- `authUrl`: http://localhost:8080/api/v1
- `ecommUrl`: http://localhost:8081/api/v1
- `auth-token`: Token JWT de l'utilisateur normal
- `admin-token`: Token JWT de l'administrateur
- `user-id`: ID de l'utilisateur
- `category-id`: ID de la catégorie créée
- `article-id`: ID de l'article créé
- `cart-item-id`: ID de l'item dans le panier

**Note**: Les tokens et IDs sont automatiquement mis à jour par les scripts post-response.

## 🧪 Flow de tests E2E

### Phase 1 : Authentification

#### 1.1 Créer le premier administrateur
```
POST /api/v1/signup
```
- Crée le premier compte qui devient automatiquement admin (trigger SQL)
- Status attendu: 201
- Utilisateur: admin / AdminPass123!

#### 1.2 Créer un utilisateur régulier
```
POST /api/v1/signup
```
- Crée un compte utilisateur normal
- Status attendu: 201
- Utilisateur: waldo / UserPass123!

#### 1.3 Se connecter en tant qu'admin
```
POST /api/v1/signin
```
- S'authentifie et récupère le token admin
- Status attendu: 200
- Le token est automatiquement stocké dans `admin-token`

#### 1.4 Se connecter en tant qu'utilisateur
```
POST /api/v1/signin
```
- S'authentifie et récupère le token utilisateur
- Status attendu: 200
- Le token est automatiquement stocké dans `auth-token`

#### 1.5 Vérifier le token admin
```
GET /api/v1/check
```
- Vérifie que le token admin est valide
- Status attendu: 200
- Vérifie que `admin: true`
- L'ID utilisateur est automatiquement stocké dans `user-id`

#### 1.6 Vérifier le token utilisateur
```
GET /api/v1/check
```
- Vérifie que le token utilisateur est valide
- Status attendu: 200
- Vérifie que `admin: false`

### Phase 2 : Gestion des catégories (Admin)

#### 2.1 Créer une catégorie
```
POST /api/admin/categories
```
- Nécessite le token admin
- Status attendu: 201
- L'ID de la catégorie est automatiquement stocké dans `category-id`

#### 2.2 Lister les catégories (Public)
```
GET /api/categories
```
- Accessible sans authentification
- Status attendu: 200
- Retourne un tableau de catégories

#### 2.3 Récupérer une catégorie (Public)
```
GET /api/categories/{id}
```
- Accessible sans authentification
- Status attendu: 200
- Utilise `category-id` automatiquement

#### 2.4 Modifier une catégorie
```
PUT /api/admin/categories/{id}
```
- Nécessite le token admin
- Status attendu: 200

### Phase 3 : Gestion des articles (Admin)

#### 3.1 Créer un article
```
POST /api/admin/articles
```
- Nécessite le token admin
- Status attendu: 201
- L'ID de l'article est automatiquement stocké dans `article-id`
- L'article est lié à la catégorie créée précédemment

#### 3.2 Lister tous les articles (Public)
```
GET /api/articles
```
- Accessible sans authentification
- Status attendu: 200
- Retourne un tableau d'articles

#### 3.3 Filtrer les articles par catégorie (Public)
```
GET /api/articles?categoryId={id}
```
- Accessible sans authentification
- Status attendu: 200
- Utilise `category-id` automatiquement

#### 3.4 Récupérer un article (Public)
```
GET /api/articles/{id}
```
- Accessible sans authentification
- Status attendu: 200
- Utilise `article-id` automatiquement

#### 3.5 Modifier un article
```
PUT /api/admin/articles/{id}
```
- Nécessite le token admin
- Status attendu: 200

### Phase 4 : Gestion du panier (Utilisateur)

#### 4.1 Consulter son panier
```
GET /api/cart
```
- Nécessite authentification (token utilisateur)
- Status attendu: 200
- Retourne les articles dans le panier de l'utilisateur connecté

#### 4.2 Ajouter un article au panier
```
POST /api/cart
```
- Nécessite authentification
- Status attendu: 201
- L'ID du cart item est automatiquement stocké dans `cart-item-id`
- Le prix est capturé au moment de l'ajout

#### 4.3 Modifier la quantité d'un article
```
PUT /api/cart/{cartItemId}
```
- Nécessite authentification
- Status attendu: 200
- Utilise `cart-item-id` automatiquement

#### 4.4 Retirer un article du panier
```
DELETE /api/cart/{cartItemId}
```
- Nécessite authentification
- Status attendu: 204
- Utilise `cart-item-id` automatiquement

#### 4.5 Vider le panier
```
DELETE /api/cart
```
- Nécessite authentification
- Status attendu: 204
- Supprime tous les articles du panier

### Phase 5 : Nettoyage (Admin)

#### 5.1 Supprimer un article
```
DELETE /api/admin/articles/{id}
```
- Nécessite le token admin
- Status attendu: 204

#### 5.2 Supprimer une catégorie
```
DELETE /api/admin/categories/{id}
```
- Nécessite le token admin
- Status attendu: 204

### Phase 6 : Déconnexion

#### 6.1 Se déconnecter
```
DELETE /api/v1/logout
```
- Révoque le token JWT
- Status attendu: 200
- Le token est ajouté à la liste noire

## 🧪 Tests automatiques

Chaque requête contient des tests automatiques qui vérifient :

✅ **Status codes** : Vérifie que la réponse a le bon code HTTP
✅ **Structure de données** : Vérifie que les champs requis sont présents
✅ **Valeurs attendues** : Vérifie que les données correspondent aux attentes
✅ **Side effects** : Vérifie que les opérations ont l'effet escompté

### Scripts post-response

Les scripts post-response automatisent le workflow :
- Extraction et stockage automatique des tokens
- Extraction et stockage automatique des IDs
- Logs de confirmation dans la console
- Calculs automatiques (ex: total du panier)

## 📊 Console de logs

Chaque requête affiche des logs informatifs :

```
✅ First admin user created successfully
✅ Admin token saved: eyJhbGciOiJIUzI1Ni...
✅ Category created with ID: 1
✅ Article created with ID: 1
   Name: iPhone 15 Pro
   Price: 1199.99 €
✅ Item added to cart with ID: 1
   Quantity: 2
   Price at add: 1199.99 €
✅ Cart retrieved: 1 items
   Total value: 2399.98 €
```

## 🔒 Sécurité

### Routes publiques (sans authentification)
- `GET /api/categories`
- `GET /api/categories/{id}`
- `GET /api/articles`
- `GET /api/articles?categoryId={id}`
- `GET /api/articles/{id}`

### Routes utilisateur (authentification requise)
- `GET /api/cart`
- `POST /api/cart`
- `PUT /api/cart/{cartItemId}`
- `DELETE /api/cart/{cartItemId}`
- `DELETE /api/cart`

### Routes admin (admin privileges requis)
- `POST /api/admin/categories`
- `PUT /api/admin/categories/{id}`
- `DELETE /api/admin/categories/{id}`
- `POST /api/admin/articles`
- `PUT /api/admin/articles/{id}`
- `DELETE /api/admin/articles/{id}`

## 🎯 Ordre d'exécution recommandé

Pour un test E2E complet, exécutez les requêtes dans l'ordre suivant :

1. **Auth** : 1 → 2 → 3 → 4 → 5 → 6
2. **Admin Categories** : 1 → 2
3. **Categories Public** : 1 → 2
4. **Admin Articles** : 1 → 2
5. **Articles Public** : 1 → 2 → 3
6. **Cart** : 1 → 2 → 3 → 4 → 5
7. **Admin Cleanup** : Articles 3 → Categories 3
8. **Auth** : 7 (Logout)

## 💡 Astuces

- Les variables `{category-id}`, `{article-id}`, `{cart-item-id}` sont automatiquement remplies
- Les tokens sont réutilisés automatiquement grâce aux variables d'environnement
- Utilisez "Run Folder" pour exécuter toutes les requêtes d'un dossier
- Les tests échouent si l'API retourne une erreur

## 🐛 Troubleshooting

### Token expiré
Si vous obtenez une erreur 401, reconnectez-vous :
- Pour admin : Exécutez "3. Signin (Admin)"
- Pour user : Exécutez "4. Signin (User)"

### Article/Catégorie non trouvé(e)
Vérifiez que vous avez bien exécuté les requêtes de création avant :
- Catégorie : "Admin/Categories/1. Create Category"
- Article : "Admin/Articles/1. Create Article"

### Base de données vide
Vérifiez que les services sont lancés :
```bash
docker compose ps
./gradlew :AuthApi:bootRun
./gradlew :EcommAPI:bootRun
```

## 📝 Notes

- Le premier utilisateur créé devient automatiquement admin (trigger SQL)
- Les tokens JWT ont une durée de vie limitée (configurable)
- Le panier est lié à l'utilisateur connecté (récupéré depuis le JWT)
- Les prix sont capturés au moment de l'ajout au panier
- La suppression d'un article supprime automatiquement ses entrées dans les paniers (CASCADE)

---

**Auteur**: Walid EL OUAZIZI
**Version**: 1.0.0
**Date**: Janvier 2026
