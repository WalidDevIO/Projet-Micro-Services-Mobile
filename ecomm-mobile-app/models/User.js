export class User {
  constructor(data) {
    this.id = data.id || null;
    this.username = data.username || '';
    this.email = data.email || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.admin = data.admin || false;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim() || this.username;
  }

  get isAdmin() {
    return this.admin === true;
  }
}
