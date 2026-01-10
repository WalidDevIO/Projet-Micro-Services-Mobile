import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Chip, Portal, Modal, TextInput, Switch } from 'react-native-paper';
import { observer } from 'mobx-react-lite';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ArticlesViewModel } from '../../lib/ArticlesViewModel';
import ArticleCard from '../../components/ArticleCard';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, TEXTS, SPACING, BORDER_RADIUS, FONT_SIZES, SHADOWS } from '../../constants/theme';

const viewModel = new ArticlesViewModel();

const ArticlesScreen = observer(() => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [localMinPrice, setLocalMinPrice] = useState('');
  const [localMaxPrice, setLocalMaxPrice] = useState('');
  const [localShowOnlyInStock, setLocalShowOnlyInStock] = useState(viewModel.showOnlyInStock);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await viewModel.loadCategories();
    await viewModel.loadArticles();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleAddToCart = async (articleId) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    await addToCart(articleId, 1);
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const openFilters = () => {
    // Sync local state with viewModel when opening modal
    setLocalMinPrice(viewModel.minPrice || '');
    setLocalMaxPrice(viewModel.maxPrice || '');
    setLocalShowOnlyInStock(viewModel.showOnlyInStock);
    setFiltersVisible(true);
  };

  const applyFilters = () => {
    viewModel.setPriceRange(localMinPrice, localMaxPrice);
    viewModel.setShowOnlyInStock(localShowOnlyInStock);
    setFiltersVisible(false);
  };

  const clearFilters = () => {
    viewModel.clearFilters();
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setLocalShowOnlyInStock(false);
  };

  const sortOptions = [
    { key: 'none', label: TEXTS.articles.sortDefault },
    { key: 'price_asc', label: TEXTS.articles.sortPriceAsc },
    { key: 'price_desc', label: TEXTS.articles.sortPriceDesc },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>{TEXTS.articles.title}</Text>
            <Text style={styles.headerSubtitle}>
              {viewModel.filteredArticles.length} {TEXTS.articles.title.toLowerCase()}
            </Text>
          </View>

          {!isAuthenticated && (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <LinearGradient
                colors={COLORS.gradientPrimary}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButtonGradient}
              >
                <MaterialCommunityIcons name="login" size={18} color={COLORS.textOnPrimary} />
                <Text style={styles.loginButtonText}>{TEXTS.auth.login}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity
            style={[styles.categoryChip, !viewModel.selectedCategoryId && styles.categoryChipActive]}
            onPress={() => viewModel.setCategory(null)}
          >
            <Text style={[
              styles.categoryChipText,
              !viewModel.selectedCategoryId && styles.categoryChipTextActive
            ]}>
              {TEXTS.articles.all}
            </Text>
          </TouchableOpacity>
          {viewModel.categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                viewModel.selectedCategoryId === category.id && styles.categoryChipActive
              ]}
              onPress={() => viewModel.setCategory(category.id)}
            >
              <Text style={[
                styles.categoryChipText,
                viewModel.selectedCategoryId === category.id && styles.categoryChipTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Filter Row */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={openFilters}
          >
            <MaterialCommunityIcons name="filter-variant" size={18} color={COLORS.text} />
            <Text style={styles.filterButtonText}>{TEXTS.articles.filters}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setSortMenuVisible(true)}
          >
            <MaterialCommunityIcons name="sort" size={18} color={COLORS.text} />
            <Text style={styles.filterButtonText}>{TEXTS.articles.sort}</Text>
          </TouchableOpacity>

          {(viewModel.selectedCategoryId || viewModel.minPrice || viewModel.maxPrice || viewModel.showOnlyInStock) && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <MaterialCommunityIcons name="close" size={16} color={COLORS.error} />
              <Text style={styles.clearButtonText}>{TEXTS.articles.clearFilters}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Articles List */}
      <FlatList
        data={viewModel.filteredArticles}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onAddToCart={handleAddToCart}
            isAuthenticated={isAuthenticated}
          />
        )}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Sort Modal */}
      <Portal>
        <Modal
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>{TEXTS.articles.sort}</Text>
          {sortOptions.map(option => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.sortOption,
                viewModel.sortOrder === option.key && styles.sortOptionActive
              ]}
              onPress={() => {
                viewModel.setSortOrder(option.key);
                setSortMenuVisible(false);
              }}
            >
              <Text style={[
                styles.sortOptionText,
                viewModel.sortOrder === option.key && styles.sortOptionTextActive
              ]}>
                {option.label}
              </Text>
              {viewModel.sortOrder === option.key && (
                <MaterialCommunityIcons name="check" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </Modal>
      </Portal>

      {/* Filters Modal */}
      <Portal>
        <Modal
          visible={filtersVisible}
          onDismiss={() => setFiltersVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <Text style={styles.modalTitle}>{TEXTS.articles.filters}</Text>

          <TextInput
            label={TEXTS.articles.minPrice}
            value={localMinPrice}
            onChangeText={setLocalMinPrice}
            keyboardType="numeric"
            mode="outlined"
            style={styles.priceInput}
            textColor={COLORS.text}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
          />

          <TextInput
            label={TEXTS.articles.maxPrice}
            value={localMaxPrice}
            onChangeText={setLocalMaxPrice}
            keyboardType="numeric"
            mode="outlined"
            style={styles.priceInput}
            textColor={COLORS.text}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
          />

          <TouchableOpacity
            style={styles.switchRow}
            onPress={() => setLocalShowOnlyInStock(!localShowOnlyInStock)}
          >
            <Text style={styles.switchLabel}>{TEXTS.articles.inStockOnly}</Text>
            <View style={[styles.toggleButton, localShowOnlyInStock && styles.toggleButtonActive]}>
              <MaterialCommunityIcons
                name={localShowOnlyInStock ? "check" : "close"}
                size={16}
                color={localShowOnlyInStock ? COLORS.textOnPrimary : COLORS.textLight}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
            <LinearGradient
              colors={COLORS.gradientPrimary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.applyButtonGradient}
            >
              <Text style={styles.applyButtonText}>{TEXTS.articles.applyFilters}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Modal>
      </Portal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.surface,
    paddingTop: 50,
    paddingBottom: SPACING.md,
    ...SHADOWS.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
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
  loginButton: {
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  loginButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    gap: SPACING.xs,
  },
  loginButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  categoriesScroll: {
    marginBottom: SPACING.sm,
  },
  categoriesContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: COLORS.textOnPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background,
    gap: SPACING.xs,
  },
  filterButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    gap: 4,
  },
  clearButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.error,
    fontWeight: '500',
  },
  listContent: {
    padding: SPACING.md,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  sortOptionActive: {
    backgroundColor: 'rgba(108, 99, 255, 0.05)',
    marginHorizontal: -SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  sortOptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  sortOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  priceInput: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  switchLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  toggleButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  toggleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  applyButton: {
    marginTop: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  applyButtonText: {
    color: COLORS.textOnPrimary,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
});

export default ArticlesScreen;
