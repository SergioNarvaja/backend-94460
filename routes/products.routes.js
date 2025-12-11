import { Router } from "express";
import ProductManager from "../dao/productManager.js";

const router = Router();
const pm = new ProductManager("./data/products.json");

router.get("/", async (req, res) => {
  const products = await pm.getProducts();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const product = await pm.getProductById(req.params.pid);
  res.json(product);
});

router.post("/", async (req, res) => {
  const newProduct = await pm.addProduct(req.body);
  res.json(newProduct);
});

router.put("/:pid", async (req, res) => {
  const updated = await pm.updateProduct(req.params.pid, req.body);
  res.json(updated);
});

router.delete("/:pid", async (req, res) => {
  const deleted = await pm.deleteProduct(req.params.pid);
  res.json(deleted);
});

export default router;