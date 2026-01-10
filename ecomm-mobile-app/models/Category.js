export class Category {
  constructor(data) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.createdAt = data.createdAt || null;
  }
}
