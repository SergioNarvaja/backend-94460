import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager("./data/carts.json");

router.post("/", async (req, res) => {
  const newCart = await cartManager.createCart();
  res.json(newCart);
});

router.get("/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  cart
    ? res.json(cart.products)
    : res.status(404).json({ error: "Carrito no encontrado" });
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const updated = await cartManager.addProductToCart(cid, pid);
  updated
    ? res.json(updated)
    : res.status(404).json({ error: "Carrito o producto no encontrado" });
});

export default router;