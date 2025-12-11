import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import ProductManager from "./dao/productManager.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const productManager = new ProductManager("./data/products.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products });
});

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Server escuchando en http://localhost:${PORT}`);
});

const io = new Server(httpServer);
export { io };

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("newProduct", async (product) => {

    const saved = await productManager.addProduct(product);

    io.emit("updateProducts", saved);
  });

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProduct(id);

    io.emit("removeProduct", id);
  });
});