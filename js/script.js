// =========================
// Toggle menu Aksesoris
// =========================
const navbarNav = document.querySelector(".navbar-nav");
const AksesorisMenu = document.querySelector("#Aksesoris-menu");

AksesorisMenu.onclick = () => {
  navbarNav.classList.toggle("active");
};

document.addEventListener("click", (e) => {
  if (!AksesorisMenu.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
});

// =========================
// Konfigurasi API
// =========================
const apiUrl = "/api/products";

// =========================
// Fungsi buat kartu produk
// =========================
function buatKartuProduk(produk) {
  return `
    <div class="product-card">
      <img src="${produk.imageFilename 
        ? `/uploads/products/${produk.imageFilename}` 
        : 'https://via.placeholder.com/300x300?text=No+Image'}" alt="${produk.nama}">
      <h3>${produk.nama}</h3>
      <p class="harga">Rp ${Number(produk.harga).toLocaleString()}</p>
      <button onclick="addToCart('${produk._id}', '${produk.nama}', ${produk.harga}, '${produk.imageFilename || ''}')">
        Tambah ke Keranjang
      </button>
    </div>
  `;
}

// =========================
// Fungsi ambil & tampilkan produk
// =========================
async function fetchProducts(keyword = "") {
  const container = document.getElementById("product-list") || document.getElementById("productGrid");
  if (!container) return;

  try {
    let url = apiUrl;
    if (keyword) {
      url += `?q=${encodeURIComponent(keyword)}`;
    }

    const res = await fetch(url);
    const products = await res.json();

    if (!products.length) {
      container.innerHTML = "<p>Tidak ada produk ditemukan.</p>";
      return;
    }

    container.innerHTML = products.map(buatKartuProduk).join("");
  } catch (err) {
    console.error("❌ Gagal memuat produk:", err);
    container.innerHTML = "<p>Terjadi kesalahan saat memuat produk.</p>";
  }
}

// =========================
// Event search (klik & Enter)
// =========================
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

if (searchBtn && searchInput) {
  searchBtn.addEventListener("click", () => {
    const keyword = searchInput.value.trim();
    fetchProducts(keyword);
  });

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchBtn.click();
    }
  });
}

// =========================
// Keranjang & WA
// =========================
const cartBtn = document.getElementById("shopping-cart");
if (cartBtn) {
  cartBtn.addEventListener("click", () => {
    window.location.href = "cart.html";
  });
}

const waIcon = document.querySelector(".wa-icon");
if (waIcon) {
  waIcon.addEventListener("click", (e) => {
    e.preventDefault();
    const box = document.querySelector(".wa-questions");
    box.style.display = box.style.display === "block" ? "none" : "block";
  });
}

function sendWA(pesan) {
  const nomor = "6281234567890"; // ganti dengan nomor WA kamu
  const url = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
  window.open(url, "_blank");
}

// =========================
// Fungsi tambah ke keranjang
// =========================
function addToCart(id, name, price, gambar) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const index = cart.findIndex((item) => item.id === id);
  if (index !== -1) {
    cart[index].qty += 1;
  } else {
    cart.push({
      id,
      name,
      price,
      gambar,
      qty: 1,
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produk ditambahkan ke keranjang!");
}

// =========================
// Load produk otomatis di index
// =========================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("product-list")) {
    fetchProducts();
  }
});
