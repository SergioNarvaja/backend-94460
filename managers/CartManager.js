const fs = require("fs").promises;
const path = require("path");

class CartManager {
  constructor(filename = "carts.json") {
    this.path = path.join(__dirname, "..", "data", filename);
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      return JSON.parse(data || "[]");
    } catch (err) {
      if (err.code === "ENOENT") {
        await fs.writeFile(this.path, "[]", "utf-8");
        return [];
      }
      throw err;
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2), "utf-8");
  }

  async _generateId(items) {
    const numericIds = items.map(c => Number(c.id)).filter(n => !isNaN(n));
    if (numericIds.length) {
      return String(Math.max(...numericIds) + 1);
    }
    return `${Date.now()}`;
  }

  async createCart() {
    const carts = await this._readFile();
    const newId = await this._generateId(carts);
    const newCart = {
      id: String(newId),
      products: []
    };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(cid) {
    const carts = await this._readFile();
    return carts.find(c => String(c.id) === String(cid)) || null;
  }

  async addProductToCart(cid, pid) {
    const carts = await this._readFile();
    const idx = carts.findIndex(c => String(c.id) === String(cid));
    if (idx === -1) return { error: "Carrito no encontrado" };

    const cart = carts[idx];
    const existing = cart.products.find(p => String(p.product) === String(pid));
    if (existing) {
      existing.quantity = Number(existing.quantity || 0) + 1;
    } else {
      cart.products.push({ product: String(pid), quantity: 1 });
    }
    carts[idx] = cart;
    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;