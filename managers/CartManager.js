import fs from "fs/promises";

class CartManager {
  constructor(path) {
    this.path = path;
  }

  async getCarts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: Date.now().toString(),
      products: [],
    };
    carts.push(newCart);
    await this.saveCarts(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find((c) => c.id == id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find((c) => c.id == cartId);
    if (!cart) return null;

    const prod = cart.products.find((p) => p.product === productId);

    if (prod) {
      prod.quantity++;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    await this.saveCarts(carts);
    return cart;
  }
}

export default CartManager;