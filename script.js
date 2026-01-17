// ---------------- GLOBAL DATA ----------------
let total = 0;
let cart = [];

// ---------------- CART ----------------
function addToCart(name, price) {
  cart.push({ name, price });
  const li = document.createElement("li");
  li.textContent = name + " - ₹" + price;
  document.getElementById("cartItems").appendChild(li);
  total += price;
  document.getElementById("total").textContent = total;
}

function buyNow(name, price) {
  cart = [];
  total = 0;
  document.getElementById("cartItems").innerHTML = "";
  addToCart(name, price);
  openForm();
}

// ---------------- CHECKOUT FORM ----------------
function openForm() {
  document.getElementById("orderForm").style.display = "block";
  // Clear previous values
  document.getElementById("fullName").value = "";
  document.getElementById("mobile").value = "";
  document.getElementById("address").value = "";
}
function closeForm() {
  document.getElementById("orderForm").style.display = "none";
}

// ---------------- PLACE ORDER ----------------
function placeOrder() {
  if (!localStorage.getItem("loggedInUser")) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const order = {
    id: "RT" + Math.floor(Math.random() * 100000),
    items: cart,
    total: total,
    status: "Processing",
    date: new Date().toLocaleDateString()
  };

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));

  alert("Payment successful! Order placed.");

  cart = [];
  total = 0;
  document.getElementById("cartItems").innerHTML = "";
  document.getElementById("total").textContent = 0;

  closeForm();
  window.location.href = "orders.html";
}

// ---------------- LOGIN ----------------
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (!user || !pass) {
    alert("Enter login details");
    return;
  }

  localStorage.setItem("loggedInUser", user);
  alert("Login successful!");
  window.location.href = "orders.html";
}

// ---------------- LOGOUT ----------------
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
}

// ---------------- LOAD ORDERS ----------------
function loadOrders() {
  if (!localStorage.getItem("loggedInUser")) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const container = document.getElementById("ordersList");

  if (!container) return;

  container.innerHTML = "";

  if (orders.length === 0) {
    container.innerHTML = "<p>No orders found</p>";
    return;
  }

  orders.forEach(order => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h3>Order ID: ${order.id}</h3>
      <p>Date: ${order.date}</p>
      <p>Status: 🚚 ${order.status}</p>
      <p>Total: ₹${order.total}</p>
      <ul>
        ${order.items.map(item => `<li>${item.name} - ₹${item.price}</li>`).join("")}
      </ul>
    `;
    container.appendChild(div);
  });
}