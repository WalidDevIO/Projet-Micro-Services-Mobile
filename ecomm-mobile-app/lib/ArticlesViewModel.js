import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import { articleService, categoryService } from '../services/ecommService';
import { Article } from '../models/Article';
import { Category } from '../models/Category';

export class ArticlesViewModel {
  articles = [];
  categories = [];
  loading = false;
  error = null;

  selectedCategoryId = null;
  minPrice = null;
  maxPrice = null;
  sortOrder = 'none';
  showOnlyInStock = false;

  constructor() {
    makeObservable(this, {
      articles: observable,
      categories: observable,
      loading: observable,
      error: observable,
      selectedCategoryId: observable,
      minPrice: observable,
      maxPrice: observable,
      sortOrder: observable,
      showOnlyInStock: observable,
      filteredArticles: computed,
      loadArticles: action,
      loadCategories: action,
      setCategory: action,
      setPriceRange: action,
      setSortOrder: action,
      setShowOnlyInStock: action,
      clearFilters: action,
    });
  }

  async loadArticles(categoryId = null) {
    runInAction(() => {
      this.loading = true;
      this.error = null;
    });

    try {
      const data = await articleService.getAll(categoryId);
      runInAction(() => {
        this.articles = data.map(a => new Article(a));
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error.message;
        this.loading = false;
      });
      console.error('Error loading articles:', error);
    }
  }

  async loadCategories() {
    try {
      const data = await categoryService.getAll();
      runInAction(() => {
        this.categories = data.map(c => new Category(c));
      });
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  get filteredArticles() {
    let filtered = [...this.articles];

    if (this.selectedCategoryId) {
      filtered = filtered.filter(a => a.categoryId === this.selectedCategoryId);
    }

    if (this.minPrice !== null && this.minPrice !== '') {
      filtered = filtered.filter(a => a.price >= parseFloat(this.minPrice));
    }

    if (this.maxPrice !== null && this.maxPrice !== '') {
      filtered = filtered.filter(a => a.price <= parseFloat(this.maxPrice));
    }

    if (this.showOnlyInStock) {
      filtered = filtered.filter(a => a.stock > 0);
    }

    if (this.sortOrder === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (this.sortOrder === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }

  setCategory(categoryId) {
    this.selectedCategoryId = categoryId;
  }

  setPriceRange(min, max) {
    this.minPrice = min;
    this.maxPrice = max;
  }

  setSortOrder(order) {
    this.sortOrder = order;
  }

  setShowOnlyInStock(value) {
    this.showOnlyInStock = value;
  }

  clearFilters() {
    this.selectedCategoryId = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.sortOrder = 'none';
    this.showOnlyInStock = false;
  }
}
