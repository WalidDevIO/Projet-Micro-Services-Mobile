# E-Commerce Mobile App - Expo Router

Application mobile React Native pour l'architecture microservices e-commerce avec Expo Router (SDK 54).

## 🏗️ Architecture

### Structure Expo Router

```
ecomm-mobile-app/
├── app/                      # Routes (Expo Router)
│   ├── _layout.jsx          # Root layout avec providers
│   ├── index.jsx            # Redirect auth/non-auth
│   ├── login.jsx            # Écran de connexion
│   └── (tabs)/              # Navigation à onglets
│       ├── _layout.jsx      # Tabs configuration
│       ├── articles.jsx     # Liste articles avec filtres
│       ├── cart.jsx         # Panier
│       └── profile.jsx      # Profil utilisateur
├── components/              # Composants réutilisables
│   ├── ArticleCard.jsx
│   └── CartItemCard.jsx
├── contexts/                # State management global
│   ├── AuthContext.js
│   └── CartContext.js
├── lib/                     # Business logic (ViewModels)
│   └── ArticlesViewModel.js
├── models/                  # Modèles de données
│   ├── User.js
│   ├── Article.js
│   ├── Category.js
│   └── CartItem.js
├── services/                # Services API
│   ├── authService.js
│   └── ecommService.js
├── constants/               # Configuration
│   └── api.js
└── hooks/                   # Custom hooks (vide)
```

## 🚀 Installation

### Prérequis

- Node.js 18+
- Expo CLI

### Setup

```bash
# Installer les dépendances
npm install

# Lancer l'app
npx expo start

# Lancer sur iOS
npx expo start --ios

# Lancer sur Android
npx expo start --android
```

## 🔧 Configuration API

**IMPORTANT** : Pour tester sur téléphone physique, changer `localhost` par votre IP locale !

Modifier `constants/api.js` :

```javascript
export const API_CONFIG = {
  AUTH_API_URL: 'http://192.168.1.100:8080/api/v1',  // ← Votre IP
  ECOMM_API_URL: 'http://192.168.1.100:8081/api',
};
```

**Trouver votre IP :**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

## 📱 Fonctionnalités

### 🔐 Authentification
- Connexion avec JWT
- Auto-login au démarrage
- Token stocké dans AsyncStorage
- Déconnexion avec révocation

### 🛍️ Articles
- Listing avec pull-to-refresh
- **Filtres** :
  - Par catégorie (chips)
  - Prix min/max
  - Stock disponible uniquement
  - Tri prix (croissant/décroissant)
- Badges stock :
  - "Plus que X en stock!" si < 5
  - "Rupture de stock" si 0

### 🛒 Panier
- Affichage panier complet
- Bouton **+** incrémenter
- Bouton **-** décrémenter (supprime si 0)
- Bouton **poubelle** supprimer direct
- Bouton "Clear Cart"
- Badge sur icône panier
- Calcul total automatique

### 👤 Profil
- Infos utilisateur
- Badge "Administrator"
- Déconnexion

## 🎨 Stack Technique

- **React Native** - Framework mobile
- **Expo Router (SDK 54)** - Navigation file-based
- **React Native Paper** - UI Material Design
- **MobX** - State management (ViewModels)
- **Axios** - HTTP client
- **AsyncStorage** - Stockage sécurisé

## 📦 Dépendances principales

```json
{
  "expo": "~54.0.0",
  "expo-router": "~4.0.0",
  "react-native-paper": "^5.12.5",
  "mobx": "^6.13.0",
  "axios": "^1.7.0",
  "@react-native-async-storage/async-storage": "2.1.0"
}
```

## 🔒 Sécurité

### Stockage du token
```javascript
await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
```

### Intercepteurs Axios
```javascript
// Auto-ajout du token
authApiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-déconnexion sur 401
authApiClient.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
    return Promise.reject(error);
  }
);
```

## 🧭 Navigation (Expo Router)

### Routes disponibles

- `/` - Index (redirect)
- `/login` - Connexion
- `/(tabs)/articles` - Articles
- `/(tabs)/cart` - Panier
- `/(tabs)/profile` - Profil

### Navigation programmatique

```javascript
import { useRouter } from 'expo-router';

const router = useRouter();

// Navigate
router.push('/(tabs)/articles');

// Replace
router.replace('/login');

// Go back
router.back();
```

## 🐛 Troubleshooting

### "Network request failed"
→ Changer `localhost` par votre IP dans `constants/api.js`

### "Unable to resolve module"
```bash
npx expo start --clear
```

### "Token expired"
→ Se reconnecter depuis l'écran de connexion

## 🎯 Différences avec l'ancien système

### Expo Router vs React Navigation

**Ancien** (React Navigation) :
```javascript
// navigation/AppNavigator.js
<Stack.Navigator>
  <Stack.Screen name="Login" component={LoginScreen} />
</Stack.Navigator>
```

**Nouveau** (Expo Router) :
```
app/
├── login.jsx              # Route: /login
├── (tabs)/
│   ├── articles.jsx       # Route: /(tabs)/articles
│   └── cart.jsx           # Route: /(tabs)/cart
```

### Avantages Expo Router
- ✅ Routing basé sur fichiers (comme Next.js)
- ✅ TypeScript auto-généré
- ✅ Deep linking automatique
- ✅ Code splitting natif
- ✅ Layouts partagés

## 📝 Scripts disponibles

```bash
# Démarrer l'app
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web

# Clear cache
npx expo start --clear
```

## 🔄 Migration depuis ancien système

Si vous avez l'ancien code (React Navigation), voici les changements :

1. **Navigation** : Remplacer `useNavigation()` par `useRouter()`
2. **Providers** : Déplacer dans `app/_layout.jsx`
3. **Screens** : Renommer en `.jsx` et déplacer dans `app/`
4. **Imports** : Changer paths relatifs

## 👨‍💻 Auteur

**Walid EL OUAZIZI**
- Email: admin@walidlab.dev

## 📄 Licence

MIT License - Projet étudiant UBO 2025-2026

---

**Built with ❤️ using React Native + Expo Router (SDK 54)**
