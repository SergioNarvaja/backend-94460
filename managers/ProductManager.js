const fs = require("fs").promises;
const path = require("path");

class ProductManager {
  constructor(filename = "products.json") {
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
    const numericIds = items.map(p => Number(p.id)).filter(n => !isNaN(n));
    if (numericIds.length) {
      return String(Math.max(...numericIds) + 1);
    }
    return `${Date.now()}`; 
  }

  async getProducts() {
    return await this._readFile();
  }

async getProductById(pid) {
    const products = await this._readFile();
    return products.find(p => String(p.id) === String(pid)) || null;
}

async addProduct(productData) {
    const products = await this._readFile();
    const newId = await this._generateId(products);

    const newProduct = {
    id: String(newId),
    title: productData.title || "",
    description: productData.description || "",
    code: productData.code || "",
    price: Number(productData.price) || 0,
    status: productData.status === undefined ? true : Boolean(productData.status),
    stock: Number(productData.stock) || 0,
    category: productData.category || "",
    thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : []
    };

    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
}

async updateProduct(pid, updateData) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(pid));
    if (idx === -1) return null;

    const product = products[idx];
    const { id, ...rest } = updateData;
    products[idx] = { ...product, ...rest, id: product.id };
    await this._writeFile(products);
    return products[idx];
    }

async deleteProduct(pid) {
    const products = await this._readFile();
    const idx = products.findIndex(p => String(p.id) === String(pid));
    if (idx === -1) return false;
    products.splice(idx, 1);
    await this._writeFile(products);
    return true;
    }
}

module.exports = ProductManager;