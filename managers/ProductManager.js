import fs from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find((p) => p.id == id);
  }

  async addProduct(product) {
    const products = await this.getProducts();
    const newProduct = {
      ...product,
      id: Date.now().toString(),
    };
    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, data) {
    const products = await this.getProducts();
    const index = products.findIndex((p) => p.id == id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...data, id: products[index].id };
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const newList = products.filter((p) => p.id != id);
    if (newList.length === products.length) return null;

    await fs.writeFile(this.path, JSON.stringify(newList, null, 2));
    return true;
  }
}

export default ProductManager;