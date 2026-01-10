export class Article {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.price = parseFloat(data.price) || 0;
    this.stock = parseInt(data.stock) || 0;
    this.categoryId = data.categoryId || null;
    this.imageUrl = data.imageUrl || null;
    this.createdAt = data.createdAt || null;
    this.updatedAt = data.updatedAt || null;
  }

  get isLowStock() {
    return this.stock > 0 && this.stock < 5;
  }

  get isOutOfStock() {
    return this.stock === 0;
  }

  get formattedPrice() {
    return `${this.price.toFixed(2)} €`;
  }

  get stockStatus() {
    if (this.isOutOfStock) return 'Rupture de stock';
    if (this.isLowStock) return `Plus que ${this.stock} en stock !`;
    return `${this.stock} disponibles`;
  }
}
