# Cahier des Charges - Application E-Commerce Mobile

**Date** : 13 janvier 2026  
**Projet** : Application mobile e-commerce avec architecture microservices

---

## 1. Membres de l'équipe

- **Walid EL OUAZIZI**
- **Clément THOMAS**
- **Jassim Akram BELYAMANI**
- **Romain MAHIER**

---

## 2. Présentation du sujet

### 2.1 Objectif
Développer une application mobile e-commerce permettant de consulter un catalogue produits, gérer un panier et administrer le contenu.

### 2.2 Fonctionnalités principales
- **Visiteur** : Consulter le catalogue, rechercher des produits
- **Client** : Gérer son panier et son profil
- **Admin** : CRUD articles et catégories, consulter les utilisateurs

### 2.3 Technologies
- **Frontend** : React Native (Expo) - Architecture MVVM
- **Backend** : Spring Boot + Jersey (JAX-RS) - 2 microservices
- **Base de données** : MariaDB
- **Authentification** : JWT avec 3 niveaux (Guest, Client, Admin)
- **Déploiement** : Docker + CI Pipeline

---

## 3. Cas d'utilisation

```
┌────────────────────────────────────────────────┐
│              Système E-Commerce                │
├────────────────────────────────────────────────┤
│                                                │
│  GUEST (Visiteur)                              │
│  ├─ Consulter catalogue                        │
│  ├─ Rechercher articles                        │
│  └─ Filtrer par catégorie/prix/stock           │
│                                                │
│  CLIENT (Utilisateur connecté)                 │
│  ├─ S'inscrire / Se connecter                  │
│  ├─ Gérer profil                               │
│  └─ Gérer panier (CRUD items)                  │
│                                                │
│  ADMIN (Administrateur)                        │
│  ├─ CRUD Articles                              │
│  ├─ CRUD Catégories                            │
│  └─ Consulter utilisateurs                     │
│                                                │
└────────────────────────────────────────────────┘
```

---

## 4. Schéma d'architecture

```
┌──────────────────────────────────┐
│  Application Mobile React Native │
│        (Architecture MVVM)       │
└────────────┬─────────────────────┘
             │ HTTP/REST + JWT
    ┌────────┴─────────┐
    ▼                  ▼
┌─────────┐      ┌──────────┐
│ AuthAPI │◄─────┤ EcommAPI │
│         │ Feign│          │
└────┬────┘      └─────┬────┘
     │                 │
     └────────┬────────┘
              ▼
    ┌──────────────────┐
    │     MariaDB      │
    └──────────────────┘
```

### Microservices

**AuthAPI** :
- Inscription / Connexion
- Génération et validation JWT
- Gestion profils utilisateurs

**EcommAPI** :
- CRUD Articles et Catégories
- Gestion panier
- Validation JWT via AuthAPI (Feign Client)

### Architecture Mobile (MVVM)

```
View <--> ViewModel <--> Model 
```

---

## 5. Résultat attendu côté mobile

### 5.1 Écrans obligatoires

| Écran | Fonctionnalités |
|-------|----------------|
| **Authentification** | Formulaires connexion/inscription, validation |
| **Catalogue** | Liste articles, recherche, filtres catégories |
| **Détail article** | Infos produit, ajout au panier, sélection quantité |
| **Panier** | Liste items, modification quantités, total |
| **Profil** | Infos utilisateur, édition, déconnexion |
| **Admin - Articles** | CRUD articles (nom, prix, stock, catégorie) |
| **Admin - Catégories** | CRUD catégories |

### 5.2 Navigation

```
/(tabs)
  ├── articles (Public)
  ├── cart (Protected - Client)
  └── profile (Protected - Client)

/admin (Protected - Admin)
  ├── articles/
  ├── categories/
  └── dashboard

/login (Public)

/index (-> /(tabs)/articles)
```

---

## 6. Modélisation de la base de données

### 6.1 Schéma BDD

```
┌─────────┐         ┌─────────────┐         ┌──────────┐
│  users  │ 1     * │ cart_items  │ *     1 │ articles │
├─────────┤◄────────┼─────────────┤─────────►├──────────┤
│ id (PK) │         │ id (PK)     │         │ id (PK)  │
│ email   │         │ user_id (FK)│         │ name     │
│ password│         │ article_id(FK)        │ price    │
│ role    │         │ quantity    │         │ stock    │
└─────────┘         │ price_at_add│         │ category_id(FK)
                    └─────────────┘         └────┬─────┘
                                                 │ *
                                                 │ 
                                                 │ 1
                                            ┌────▼────────┐
                                            │ categories  │
                                            ├─────────────┤
                                            │ id (PK)     │
                                            │ name        │
                                            └─────────────┘
```

### 6.2 Tables principales

**users** : Utilisateurs (email, password, role)  
**categories** : Catégories de produits  
**articles** : Produits (nom, prix, stock, category_id, image_url)  
**cart_items** : Panier (user_id, article_id, quantity)

### 6.3 Contraintes clés

- **users** : email UNIQUE
- **articles** : price ≥ 0, stock ≥ 0
- **cart_items** : UNIQUE(user_id, article_id), quantity > 0
- **Relations** : 
  - cart_items.user_id → users.id (ON DELETE CASCADE)
  - cart_items.article_id → articles.id (ON DELETE CASCADE)
  - articles.category_id → categories.id (ON DELETE SET NULL)

---