const socket = io();

const form = document.getElementById("createForm");
const list = document.getElementById("productList");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById("title").value,
    price: Number(document.getElementById("price").value)
  };

  socket.emit("newProduct", product);
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}

socket.on("productsUpdated", (products) => {
  list.innerHTML = "";

  products.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.title} - $${p.price}
      <button onclick="deleteProduct('${p.id}')">Eliminar</button>
    `;
    list.appendChild(li);
  });
});