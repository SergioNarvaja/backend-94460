const socket = io();

const form = document.getElementById("createForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const product = {
    title: document.getElementById("title").value,
    price: Number(document.getElementById("price").value)
  };

  socket.emit("newProduct", product);
});

socket.on("updateProducts", (product) => {
  const list = document.getElementById("productList");
  const li = document.createElement("li");
  li.dataset.id = product.id;
  li.innerHTML = `${product.title} - $${product.price}
    <button onclick="deleteProduct('${product.id}')">Eliminar</button>`;
  list.appendChild(li);
});

function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}

socket.on("removeProduct", (id) => {
  const item = document.querySelector(`li[data-id="${id}"]`);
  if (item) item.remove();
});