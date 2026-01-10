/**
 * Theme constants for the E-Commerce App
 * Modern design system with premium aesthetics
 */

export const COLORS = {
    // Primary gradient colors
    primary: '#6C63FF',
    primaryDark: '#5A52D5',
    primaryLight: '#8B85FF',

    // Accent colors
    accent: '#00D9FF',
    accentDark: '#00B8D9',

    // Gradient combinations
    gradientPrimary: ['#6C63FF', '#a855f7'],
    gradientSecondary: ['#0ea5e9', '#06b6d4'],
    gradientDanger: ['#ef4444', '#f97316'],
    gradientSuccess: ['#10b981', '#34d399'],

    // Background colors
    background: '#F8FAFC',
    backgroundDark: '#0F172A',
    surface: '#FFFFFF',
    surfaceDark: '#1E293B',

    // Text colors
    text: '#1E293B',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    textOnPrimary: '#FFFFFF',

    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // UI colors
    border: '#E2E8F0',
    divider: '#F1F5F9',
    overlay: 'rgba(0, 0, 0, 0.5)',

    // Card colors
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const FONT_SIZES = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    title: 28,
    hero: 36,
};

export const FONT_WEIGHTS = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
};

export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
};

// French translations
export const TEXTS = {
    // Navigation
    nav: {
        articles: 'Articles',
        cart: 'Panier',
        profile: 'Profil',
    },

    // Auth
    auth: {
        appName: 'E-Commerce',
        tagline: 'Découvrez nos produits',
        login: 'Connexion',
        logout: 'Déconnexion',
        username: 'Nom d\'utilisateur',
        password: 'Mot de passe',
        signIn: 'Se connecter',
        signUp: 'S\'inscrire',
        forgotPassword: 'Mot de passe oublié ?',
        noAccount: 'Pas de compte ?',
        loginToContinue: 'Connectez-vous pour continuer',
        loginRequired: 'Connexion requise',
        loginToBuy: 'Connectez-vous pour acheter',
    },

    // Articles
    articles: {
        title: 'Nos Produits',
        search: 'Rechercher...',
        all: 'Tout',
        filters: 'Filtres',
        sort: 'Trier',
        sortDefault: 'Par défaut',
        sortPriceAsc: 'Prix croissant',
        sortPriceDesc: 'Prix décroissant',
        minPrice: 'Prix min (€)',
        maxPrice: 'Prix max (€)',
        inStockOnly: 'En stock uniquement',
        applyFilters: 'Appliquer',
        clearFilters: 'Effacer',
        addToCart: 'Ajouter au panier',
        inStock: 'En stock',
        lowStock: 'Stock limité',
        outOfStock: 'Rupture de stock',
        onlyLeft: 'Plus que',
        available: 'disponibles',
    },

    // Cart
    cart: {
        title: 'Mon Panier',
        empty: 'Votre panier est vide',
        emptySubtitle: 'Ajoutez des articles pour commencer !',
        clearCart: 'Vider le panier',
        total: 'Total',
        checkout: 'Commander',
        removeItem: 'Supprimer',
        confirmClear: 'Êtes-vous sûr de vouloir vider votre panier ?',
        confirmRemove: 'Supprimer cet article ?',
        cancel: 'Annuler',
        confirm: 'Confirmer',
    },

    // Profile
    profile: {
        title: 'Mon Profil',
        accountInfo: 'Informations du compte',
        username: 'Nom d\'utilisateur',
        email: 'Email',
        firstName: 'Prénom',
        lastName: 'Nom',
        notSet: 'Non renseigné',
        settings: 'Paramètres',
        notifications: 'Notifications',
        notificationsDesc: 'Gérer les préférences de notification',
        privacy: 'Confidentialité',
        privacyDesc: 'Paramètres de sécurité',
        help: 'Aide & Support',
        helpDesc: 'Obtenir de l\'aide',
        version: 'Version',
        confirmLogout: 'Êtes-vous sûr de vouloir vous déconnecter ?',
        admin: 'Administrateur',
    },

    // Common
    common: {
        loading: 'Chargement...',
        error: 'Erreur',
        retry: 'Réessayer',
        ok: 'OK',
        yes: 'Oui',
        no: 'Non',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        close: 'Fermer',
        comingSoon: 'Bientôt disponible',
        featureNotAvailable: 'Cette fonctionnalité n\'est pas encore disponible',
    },

    // Errors
    errors: {
        fillAllFields: 'Veuillez remplir tous les champs',
        invalidCredentials: 'Identifiants invalides',
        connectionFailed: 'Échec de la connexion',
        loginFailed: 'Échec de la connexion',
    },
};
