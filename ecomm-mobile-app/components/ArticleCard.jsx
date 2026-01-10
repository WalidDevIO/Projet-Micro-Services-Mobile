import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, TEXTS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '../constants/theme';

export default function ArticleCard({ article, onAddToCart, isAuthenticated }) {
  const handleAddToCart = () => {
    if (!article.isOutOfStock) {
      onAddToCart(article.id);
    }
  };

  const getStockBadge = () => {
    if (article.isOutOfStock) {
      return { text: TEXTS.articles.outOfStock, color: COLORS.error, bgColor: 'rgba(239, 68, 68, 0.1)' };
    }
    if (article.isLowStock) {
      return { text: `${TEXTS.articles.onlyLeft} ${article.stock} !`, color: COLORS.warning, bgColor: 'rgba(245, 158, 11, 0.1)' };
    }
    return { text: TEXTS.articles.inStock, color: COLORS.success, bgColor: 'rgba(16, 185, 129, 0.1)' };
  };

  const stockBadge = getStockBadge();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.95}
      onPress={() => { }}
    >
      {/* Image Section */}
      <View style={styles.imageContainer}>
        {article.imageUrl ? (
          <Image
            source={{ uri: article.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="image-off" size={48} color={COLORS.textLight} />
          </View>
        )}

        {/* Stock Badge */}
        <View style={[styles.stockBadge, { backgroundColor: stockBadge.bgColor }]}>
          <View style={[styles.stockDot, { backgroundColor: stockBadge.color }]} />
          <Text style={[styles.stockText, { color: stockBadge.color }]}>
            {stockBadge.text}
          </Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {article.name}
        </Text>

        {article.description && (
          <Text style={styles.description} numberOfLines={2}>
            {article.description}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={styles.price}>{article.formattedPrice}</Text>

          <TouchableOpacity
            style={[
              styles.addButton,
              article.isOutOfStock && styles.addButtonDisabled
            ]}
            onPress={handleAddToCart}
            disabled={article.isOutOfStock}
          >
            {article.isOutOfStock ? (
              <Text style={styles.addButtonTextDisabled}>
                {TEXTS.articles.outOfStock}
              </Text>
            ) : (
              <LinearGradient
                colors={COLORS.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <MaterialCommunityIcons
                  name={isAuthenticated ? "cart-plus" : "login"}
                  size={18}
                  color={COLORS.textOnPrimary}
                />
                <Text style={styles.addButtonText}>
                  {isAuthenticated ? TEXTS.articles.addToCart : TEXTS.auth.login}
                </Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
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
    backgroundColor: COLORS.background,
  },
  stockBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  stockText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  content: {
    padding: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  addButton: {
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  addButtonDisabled: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  addButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  addButtonTextDisabled: {
    color: COLORS.textLight,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
});
