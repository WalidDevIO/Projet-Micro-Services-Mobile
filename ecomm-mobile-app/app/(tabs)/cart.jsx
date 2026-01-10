import React from 'react';
import { View, StyleSheet, FlatList, Alert, Text, TouchableOpacity, StatusBar } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCart } from '../../contexts/CartContext';
import CartItemCard from '../../components/CartItemCard';
import { COLORS, TEXTS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '../../constants/theme';

export default function CartScreen() {
  const { cartItems, loading, total, incrementQuantity, decrementQuantity, removeItem, clearCart } = useCart();

  const handleClearCart = () => {
    Alert.alert(
      TEXTS.cart.clearCart,
      TEXTS.cart.confirmClear,
      [
        { text: TEXTS.cart.cancel, style: 'cancel' },
        { text: TEXTS.cart.confirm, style: 'destructive', onPress: clearCart },
      ]
    );
  };

  const handleRemoveItem = (itemId, itemName) => {
    Alert.alert(
      TEXTS.cart.removeItem,
      TEXTS.cart.confirmRemove,
      [
        { text: TEXTS.cart.cancel, style: 'cancel' },
        { text: TEXTS.common.delete, style: 'destructive', onPress: () => removeItem(itemId) },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{TEXTS.common.loading}</Text>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{TEXTS.cart.title}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons name="cart-outline" size={64} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyText}>{TEXTS.cart.empty}</Text>
          <Text style={styles.emptySubtext}>{TEXTS.cart.emptySubtitle}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{TEXTS.cart.title}</Text>
          <Text style={styles.headerSubtitle}>
            {cartItems.length} article{cartItems.length > 1 ? 's' : ''}
          </Text>
        </View>
        {cartItems.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
            <MaterialCommunityIcons name="trash-can-outline" size={18} color={COLORS.error} />
            <Text style={styles.clearButtonText}>{TEXTS.cart.clearCart}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <CartItemCard
            item={item}
            onIncrement={() => incrementQuantity(item.id)}
            onDecrement={() => decrementQuantity(item.id)}
            onRemove={() => handleRemoveItem(item.id, item.article?.name || 'article')}
          />
        )}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>{TEXTS.cart.total}</Text>
          <Text style={styles.totalAmount}>{total.toFixed(2)} €</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => Alert.alert(TEXTS.common.comingSoon, TEXTS.common.featureNotAvailable)}
        >
          <LinearGradient
            colors={COLORS.gradientPrimary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutButtonGradient}
          >
            <Text style={styles.checkoutButtonText}>{TEXTS.cart.checkout}</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color={COLORS.textOnPrimary} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.title,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    gap: SPACING.xs,
  },
  clearButtonText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    ...SHADOWS.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    padding: SPACING.md,
  },
  footer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    ...SHADOWS.lg,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  totalLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  totalAmount: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  checkoutButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  checkoutButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  checkoutButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },
});
