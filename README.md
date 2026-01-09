# Cahier des Charges - Application E-Commerce (Version non définitive)

## 1. Contexte et Objectifs

### 1.1 Présentation du projet
Développement d'une application mobile e-commerce avec architecture microservices, permettant la gestion d'un catalogue produits et d'un système de panier, dans le cadre d'un projet académique.

### 1.2 Objectifs principaux
- Créer une plateforme e-commerce avec gestion des utilisateurs, articles et panier
- Mettre en œuvre une architecture microservices (2 APIs minimum)
- Assurer la qualité du code via des tests unitaires et une architecture MVVM
- Implémenter un système d'authentification JWT robuste

## 2. Architecture Technique

### 2.1 Architecture globale
```
[Application Mobile React Native]
            ↓ HTTP/REST
    [Microservices Backend]
    ├── Service Auth/Users (Port 8081)
    └── Service Catalogue/Panier (Port 8082)
            ↓
    [Base de données SQL - PostgreSQL/MySQL]
```

### 2.2 Stack technique

#### Frontend Mobile
- **Framework** : React Native
- **Architecture** : MVVM (Model-View-ViewModel)
- **Gestion d'état** : Context API ou Redux
- **Navigation** : React Navigation
- **Tests** : Jest + React Native Testing Library
- **HTTP Client** : Axios

#### Backend
- **Framework** : Spring Boot 3.x
- **API REST** : Jersey (JAX-RS)
- **Sécurité** : Spring Security + JWT
- **ORM** : JPA/Hibernate
- **Tests** : JUnit 5 + Mockito
- **Documentation** : Swagger/OpenAPI
- **Build** : Maven

#### Base de données
- **SGBD** : PostgreSQL (recommandé) ou MySQL
- **Choix justifié** :
  - Transactions ACID pour l'intégrité des données
  - Relations entre entités (users, articles, catégories, paniers)
  - Contraintes d'intégrité référentielle
  - Performance avec indexation appropriée

## 3. Spécifications Fonctionnelles

### 3.1 Gestion des utilisateurs et authentification

#### 3.1.1 Trois niveaux d'accès

1. **Anonyme**
   - Consultation du catalogue
   - Recherche de produits
   - Visualisation des détails produits
   - Navigation libre (sans panier persistant)

2. **Client connecté**
   - Toutes les fonctionnalités anonyme +
   - Gestion du panier persistant
   - Ajout/modification/suppression d'articles dans le panier
   - Gestion du profil utilisateur

3. **Administrateur**
   - Toutes les fonctionnalités client +
   - Gestion du catalogue (CRUD articles)
   - Gestion des catégories (CRUD)
   - Consultation de la liste des utilisateurs

#### 3.1.2 Authentification JWT
- Connexion avec email/mot de passe
- Génération de tokens JWT (access token)
- Refresh token (optionnel mais recommandé)
- Déconnexion
- Stockage sécurisé des tokens (AsyncStorage sécurisé)

### 3.2 Écrans de l'application mobile

#### Écran 1 : Authentification
**Fonctionnalités** :
- Formulaire de connexion (email, mot de passe)
- Formulaire d'inscription
- Validation côté client (format email, longueur mot de passe)
- Gestion des erreurs (affichage messages clairs)
- Loader pendant les requêtes

#### Écran 2 : Listing des produits
**Fonctionnalités** :
- Liste des articles avec pagination
- Filtres par catégorie
- Barre de recherche
- Tri (prix croissant/décroissant, nom)
- Affichage : image, nom, prix
- Pull-to-refresh
- Navigation vers détail produit

#### Écran 3 : Détail produit
**Fonctionnalités** :
- Image du produit
- Nom, description, prix
- Stock disponible
- Sélection de quantité
- Bouton "Ajouter au panier"
- Feedback visuel après ajout

#### Écran 4 : Panier
**Fonctionnalités** :
- Liste des articles ajoutés (client connecté uniquement)
- Affichage : image, nom, prix unitaire, quantité, sous-total
- Modification de quantité (+/-)
- Suppression d'articles
- Calcul du total général
- Vider le panier (avec confirmation)
- Message si panier vide

**Règles métier** :
- Synchronisation automatique avec le backend
- Vérification des stocks avant ajout
- Mise à jour des prix si changement

#### Écran 5 : Gestion Admin
**Fonctionnalités** :

**Onglet Articles** :
- Liste des articles avec recherche
- Bouton "Ajouter un article"
- Actions : Modifier / Supprimer (avec confirmation)
- Formulaire création/édition :
  - Nom, description, prix, stock
  - Sélection de catégorie
  - Upload d'image (URL ou upload)

**Onglet Catégories** :
- Liste des catégories
- CRUD complet (Create, Read, Update, Delete)
- Formulaire simple : nom, description

**Onglet Utilisateurs** (optionnel) :
- Liste des utilisateurs inscrits
- Consultation uniquement (pas de modification)

### 3.3 API Backend - Ressources

#### API 1 : Authentification & Utilisateurs (Port 8081)

**Endpoints** :

**POST /api/auth/register**
```json
Request: {
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
Response: {
  "accessToken": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT"
  }
}
```

**POST /api/auth/login**
```json
Request: {
  "email": "user@example.com",
  "password": "password123"
}
Response: {
  "accessToken": "jwt_token",
  "user": { ... }
}
```

**GET /api/users/me** (authenticated)
- Récupère le profil de l'utilisateur connecté

**PUT /api/users/me** (authenticated)
- Mise à jour du profil

**GET /api/users** (admin only)
- Liste de tous les utilisateurs

#### API 2 : Catalogue & Panier (Port 8082)

**Endpoints Articles** :

**GET /api/articles**
- Query params : page, size, categoryId, search, sortBy
- Response : liste paginée

**GET /api/articles/{id}**
- Détails d'un article

**POST /api/articles** (admin)
- Création d'un article

**PUT /api/articles/{id}** (admin)
- Modification d'un article

**DELETE /api/articles/{id}** (admin)
- Suppression d'un article

**Endpoints Catégories** :

**GET /api/categories**
- Liste de toutes les catégories

**POST /api/categories** (admin)
**PUT /api/categories/{id}** (admin)
**DELETE /api/categories/{id}** (admin)

**Endpoints Panier** :

**GET /api/cart** (authenticated)
- Récupère le panier de l'utilisateur connecté

**POST /api/cart/items** (authenticated)
```json
Request: {
  "articleId": 1,
  "quantity": 2
}
```

**PUT /api/cart/items/{articleId}** (authenticated)
```json
Request: {
  "quantity": 3
}
```

**DELETE /api/cart/items/{articleId}** (authenticated)
- Supprime un article du panier

**DELETE /api/cart** (authenticated)
- Vide complètement le panier

### 3.4 Modèles de données (SQL)

#### Table : users
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL, -- hashed
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  role VARCHAR(20) NOT NULL, -- ADMIN, CLIENT
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table : categories
```sql
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table : articles
```sql
CREATE TABLE articles (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category_id BIGINT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);
```

#### Table : carts
```sql
CREATE TABLE carts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### Table : cart_items
```sql
CREATE TABLE cart_items (
  id BIGSERIAL PRIMARY KEY,
  cart_id BIGINT NOT NULL,
  article_id BIGINT NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_add DECIMAL(10, 2) NOT NULL, -- prix au moment de l'ajout
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  UNIQUE(cart_id, article_id)
);
```

## 4. Exigences Non-Fonctionnelles

### 4.1 Sécurité
- ✅ Authentification JWT avec expiration (30min - 1h)
- ✅ Hachage bcrypt des mots de passe (salt rounds: 10)
- ✅ Validation des entrées côté backend
- ✅ Protection CORS configurée
- ✅ HTTPS en production (simulable en dev)
- ✅ Autorisation basée sur les rôles

### 4.2 Performance
- Temps de réponse API < 500ms
- Pagination obligatoire (20-50 items/page)
- Index sur colonnes fréquemment recherchées (email, category_id)
- Lazy loading des images côté mobile

### 4.3 Qualité du code

**Frontend** :
- Architecture MVVM stricte (séparation View/ViewModel/Model)
- Tests unitaires des ViewModels (> 60%)
- Code ES6+ propre avec ESLint
- Composants réutilisables

**Backend** :
- Tests unitaires des services (> 70%)
- Tests d'intégration des endpoints principaux
- Documentation Swagger/OpenAPI
- Gestion propre des exceptions
- DTOs pour séparer entités et API

### 4.4 Scalabilité
- Microservices déployables indépendamment
- Configuration externalisée (application.properties/yml)
- API stateless (JWT uniquement)
- Possibilité d'ajouter un API Gateway plus tard

## 5. Livrables

### 5.1 Code source
- Repository Git avec structure claire
- README.md avec :
  - Prérequis (Node, Java, PostgreSQL)
  - Instructions d'installation
  - Scripts de lancement
  - Architecture du projet

### 5.2 Base de données
- Scripts SQL de création des tables
- Données de test (seed data)
- Schéma de la base (MCD/ERD)

### 5.3 Documentation
- Documentation API (Swagger accessible via /swagger-ui)
- Diagrammes d'architecture
- Guide utilisateur basique

### 5.4 Tests
- Tests unitaires fonctionnels
- Rapport de couverture
- Collection Postman/Insomnia pour tester l'API

### 5.5 Démonstration
- Application mobile fonctionnelle (au moins un émulateur)
- Scénarios de démonstration :
  1. Inscription → Connexion
  2. Navigation catalogue → Ajout panier
  3. Gestion panier
  4. Connexion admin → Gestion articles

## 6. Planning Suggéré

**Phase 1 - Setup (3-4 jours)**
- Configuration projet React Native
- Configuration Spring Boot (2 services)
- Mise en place PostgreSQL + scripts SQL
- Configuration JWT

**Phase 2 - Backend Auth (4-5 jours)**
- Service Auth complet
- Gestion users
- Tests unitaires
- Documentation Swagger

**Phase 3 - Backend Catalogue (5-6 jours)**
- CRUD Articles et Catégories
- Gestion Panier
- Tests unitaires
- Intégration avec Auth (JWT)

**Phase 4 - Frontend Auth & Navigation (4-5 jours)**
- Écran auth + inscription
- Architecture MVVM
- Navigation
- Tests ViewModels

**Phase 5 - Frontend Catalogue (5-6 jours)**
- Écran listing
- Écran détail
- Écran panier
- Intégration API

**Phase 6 - Frontend Admin (4-5 jours)**
- Écran gestion
- CRUD articles/catégories
- Tests

**Phase 7 - Finalisation (3-4 jours)**
- Tests end-to-end
- Corrections bugs
- Documentation finale
- Préparation démo

**Total : ~6-7 semaines**

## 7. Points d'Attention

⚠️ **Critiques** :
- **Gestion du panier** : bien penser la synchronisation mobile ↔ backend
- **Stocks** : vérifier la disponibilité avant ajout au panier
- **JWT** : prévoir une durée d'expiration raisonnable
- **Tests** : ne pas négliger, c'est un critère d'évaluation

💡 **Recommandations** :
- Commencer par un utilisateur admin en dur dans la BDD
- Utiliser Postman pour tester l'API au fur et à mesure
- Faire des commits réguliers et descriptifs
- Tester sur un vrai device mobile si possible

🎯 **Scope réaliste** :
- Pas de paiement (on s'arrête au panier ✅)
- Pas de gestion de commandes
- Images : URLs simples (pas d'upload complexe)
- Design simple mais propre (pas besoin d'animations folles)

---

**Ce cahier des charges définit un projet réaliste et complet pour un contexte académique, avec un bon équilibre entre ambition technique et faisabilité.**
