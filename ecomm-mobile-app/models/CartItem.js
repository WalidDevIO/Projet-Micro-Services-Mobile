export class CartItem {
  constructor(data) {
    this.id = data.id || null;
    this.userId = data.userId || null;
    this.articleId = data.articleId || null;
    this.quantity = parseInt(data.quantity) || 1;
    this.priceAtAdd = parseFloat(data.priceAtAdd) || 0;
    this.createdAt = data.createdAt || null;
    this.article = data.article || null;
  }

  get totalPrice() {
    if (this.article) {
      return this.article.price * this.quantity;
    }
    return this.priceAtAdd * this.quantity;
  }

  get formattedTotal() {
    return `${this.totalPrice.toFixed(2)} €`;
  }

  get currentPrice() {
    return this.article ? this.article.price : this.priceAtAdd;
  }
}
