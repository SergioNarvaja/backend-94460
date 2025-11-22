const express = require("express");
const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
res.send("Servidor funcionando correctamente");
});

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
console.log(`Server escuchando en http://localhost:${PORT}`);
});