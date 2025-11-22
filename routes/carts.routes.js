const express = require("express");
const CartManager = require("../managers/CartManager");
const router = express.Router();
const cm = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cm.createCart();
    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ error: "Error al crear carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await cm.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart.products);
  } catch (err) {
    res.status(500).json({ error: "Error al leer carrito" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const result = await cm.addProductToCart(req.params.cid, req.params.pid);
    if (result && result.error) return res.status(404).json(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al agregar producto al carrito" });
  }
});

module.exports = router;