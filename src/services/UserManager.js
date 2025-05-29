class UserManager {
  constructor() {
    this.users = [];
  }

  create({ id, name, cellphone }) {
    const u = { id, name, cellphone, createdAt: new Date().toISOString() };
    this.users.push(u);
    return u;
  }

  get_info({ id }) {
    const u = this.users.find(x => x.id === id);
    if (!u) throw new Error('User not found');
    return { name: u.name, createdAt: u.createdAt };
  }

  _admin_list() {
    return this.users;
  }

  _admin_delete({ id }) {
    const before = this.users.length;
    this.users = this.users.filter(x => x.id !== id);
    return { deleted: before - this.users.length };
  }
}

module.exports = new UserManager();
