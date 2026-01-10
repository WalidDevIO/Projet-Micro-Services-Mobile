import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TEXTS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';

export default function CartItemCard({ item, onIncrement, onDecrement, onRemove }) {
  const article = item.article;

  return (
    <View style={styles.card}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {article?.imageUrl ? (
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="image-off" size={24} color={COLORS.textLight} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {article?.name || 'Article'}
        </Text>

        <Text style={styles.unitPrice}>
          {article?.formattedPrice || `${item.currentPrice.toFixed(2)} €`}
        </Text>

        {article?.isLowStock && (
          <View style={styles.lowStockBadge}>
            <MaterialCommunityIcons name="alert" size={12} color={COLORS.warning} />
            <Text style={styles.lowStockText}>
              {TEXTS.articles.onlyLeft} {article.stock} !
            </Text>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {/* Delete Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={onRemove}>
          <MaterialCommunityIcons name="trash-can-outline" size={20} color={COLORS.error} />
        </TouchableOpacity>

        {/* Quantity Stepper */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
            onPress={onDecrement}
            disabled={item.quantity <= 1}
          >
            <MaterialCommunityIcons
              name="minus"
              size={16}
              color={item.quantity <= 1 ? COLORS.textLight : COLORS.text}
            />
          </TouchableOpacity>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={onIncrement}
            disabled={article?.isOutOfStock || item.quantity >= (article?.stock || 999)}
          >
            <MaterialCommunityIcons name="plus" size={16} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Total */}
        <Text style={styles.total}>{item.formattedTotal}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    ...SHADOWS.sm,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  unitPrice: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  lowStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  lowStockText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.warning,
    fontWeight: '500',
  },
  actions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.full,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    minWidth: 30,
    textAlign: 'center',
  },
  total: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
