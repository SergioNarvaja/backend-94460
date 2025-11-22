const express = require("express");
const ProductManager = require("../managers/ProductManager");
const router = express.Router();
const pm = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await pm.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error al leer productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const product = await pm.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error al buscar producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await pm.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: "Error al crear producto" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    if (req.body.id && String(req.body.id) !== String(req.params.pid)) {
      // impedir cambio de id
      return res.status(400).json({ error: "No está permitido modificar el id" });
    }
    const updated = await pm.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const deleted = await pm.deleteProduct(req.params.pid);
    if (!deleted) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

module.exports = router;