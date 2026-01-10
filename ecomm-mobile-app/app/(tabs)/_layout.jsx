import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, TEXTS } from '../../constants/theme';

export default function TabsLayout() {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="articles"
        options={{
          title: TEXTS.nav.articles,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: TEXTS.nav.cart,
          href: isAuthenticated ? undefined : null,
          tabBarBadge: isAuthenticated && itemCount > 0 ? itemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.error,
            fontSize: 10,
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: TEXTS.nav.profile,
          href: isAuthenticated ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
