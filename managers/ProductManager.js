import fs from "fs/promises";

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    const data = await fs.readFile(this.path, "utf-8");
    return JSON.parse(data);
  }

  async addProduct(product) {
    const products = await this.getProducts();

    const newProduct = {
      ...product,
      id: Date.now().toString()
    };

    products.push(newProduct);

    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();

    const filteredProducts = products.filter(p => p.id !== id);

    await fs.writeFile(
      this.path,
      JSON.stringify(filteredProducts, null, 2)
    );

    return true;
  }
}

export default ProductManager;