document.addEventListener("DOMContentLoaded", async () => {
  const base = "http://localhost:5000";

  try {
    const res = await fetch(`${base}/api/content`);
    const content = await res.json();

    // === HERO ===
    const elHeroTitle = document.getElementById("hero-title");
    const elHeroSubtitle = document.getElementById("hero-subtitle");
    if (content.heroTitle && elHeroTitle) elHeroTitle.innerHTML = content.heroTitle;
    if (content.heroSubtitle && elHeroSubtitle) elHeroSubtitle.textContent = content.heroSubtitle;
    if (content.heroTitleColor && elHeroTitle) elHeroTitle.style.color = content.heroTitleColor;
    if (content.heroSubtitleColor && elHeroSubtitle) elHeroSubtitle.style.color = content.heroSubtitleColor;
    if (content.heroBackgroundImage) {
      const heroEl = document.querySelector(".hero");
      if (heroEl) {
        const img = content.heroBackgroundImage;
        const full = img.startsWith("http") ? img : `${base}${img.startsWith("/") ? img : "/" + img}`;
        heroEl.style.backgroundImage = `url(${full})`;
      }
    }

    // === KONTAK ===
    if (content.contactInfo?.phone) {
      const phoneEl = document.getElementById("contact-phone");
      if (phoneEl) {
        phoneEl.textContent = content.contactInfo.phone;
        if (phoneEl.tagName === "A") {
          phoneEl.href = `https://wa.me/${content.contactInfo.phone}`;
        } else {
          const phoneAnchor = document.querySelector("#contact-phone-link");
          if (phoneAnchor) phoneAnchor.href = `https://wa.me/${content.contactInfo.phone}`;
        }
      }
    }
    if (content.contactInfo?.email) {
      const emailEl = document.getElementById("contact-email");
      if (emailEl) {
        emailEl.textContent = content.contactInfo.email;
        if (emailEl.tagName === "A") emailEl.href = `mailto:${content.contactInfo.email}`;
      }
    }
    if (content.contactInfo?.address) {
      const addrEl = document.getElementById("contact-address");
      if (addrEl) addrEl.textContent = content.contactInfo.address;
    }

    // === WHATSAPP ===
    if (content.whatsapp?.bubbleButton) {
      const bubble = document.querySelector(".wa-bubble a");
      if (bubble) bubble.href = `https://wa.me/${content.whatsapp.bubbleButton}`;
    }
    if (content.whatsapp?.contactButton) {
      const cta = document.querySelector(".contact .cta");
      if (cta) cta.href = `https://wa.me/${content.whatsapp.contactButton}`;
    }

    // === SOCIAL MEDIA ===
    if (content.socialMedia?.instagram) {
      const ig = document.querySelector(".socials .fa-instagram");
      if (ig?.parentElement) ig.parentElement.href = content.socialMedia.instagram;
    }
    if (content.socialMedia?.facebook) {
      const fb = document.querySelector(".socials .fa-facebook");
      if (fb?.parentElement) fb.parentElement.href = content.socialMedia.facebook;
    }
    if (content.socialMedia?.tiktok) {
      const tt = document.querySelector(".socials .fa-tiktok");
      if (tt?.parentElement) tt.parentElement.href = content.socialMedia.tiktok;
    }

    // === THEME COLORS ===
    if (content.theme?.primaryColor) {
      document.documentElement.style.setProperty("--primary", content.theme.primaryColor);
    }
    if (content.theme?.backgroundColor) {
      document.documentElement.style.setProperty("--bg", content.theme.backgroundColor);
    }
  } catch (err) {
    console.error("❌ Gagal mengambil konten:", err);
  }

  // === PRODUK ===
  try {
    const res = await fetch(`${base}/api/products`);
    const products = await res.json();

    // Simpan data produk untuk pencarian dan tampilan
    window.produkData = products.map((p) => ({
      _id: p._id,
      nama: p.nama || p.name || "",
      harga: p.harga ?? p.price ?? 0,
      deskripsi: p.deskripsi || "",
      gambar: p.imageFilename
        ? `${base}/uploads/products/${p.imageFilename}`
        : "https://via.placeholder.com/300x200?text=No+Image",
    }));

    // Tampilkan semua produk pertama kali
    tampilkanProduk(window.produkData);
  } catch (err) {
    console.error("❌ Gagal mengambil produk:", err);
  }

  // Event pencarian (klik dan Enter)
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  if (searchInput) {
    searchInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        cariProduk();
      }
    });
  }
  if (searchButton) {
    searchButton.addEventListener("click", (e) => {
      e.preventDefault();
      cariProduk();
    });
  }
});

// Fungsi render produk
function tampilkanProduk(list) {
  // Sesuaikan container produk: bisa di index.html (#produk-terbaru) atau search.html (#productGrid)
  const container =
    document.getElementById("produk-terbaru") ||
    document.getElementById("productGrid");

  if (!container) return;

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p style='text-align:center; color:#e74c3c; font-weight:700;'>Produk tidak ditemukan.</p>";
    return;
  }

  list.forEach((p) => {
    const produkEl = document.createElement("div");
    produkEl.className = container.id === "productGrid" ? "product-card" : "menu-card";

    // Kalau di search.html, tombol "Beli Sekarang" WA, kalau di index.html tombol tambah keranjang
    if (container.id === "productGrid") {
      const pesanWA = encodeURIComponent(`Halo, saya mau beli produk *${p.nama}* dengan harga Rp ${Number(p.harga).toLocaleString()}`);
      produkEl.innerHTML = `
        <img src="${p.gambar}" alt="Foto produk ${p.nama}" />
        <div class="product-info">
          <h3>${p.nama}</h3>
          <p class="description">${p.deskripsi || "Deskripsi produk tidak tersedia."}</p>
          <p class="price">Rp ${Number(p.harga).toLocaleString()}</p>
          <button onclick="window.open('https://wa.me/6281234567890?text=${pesanWA}', '_blank')" aria-label="Beli produk ${p.nama} sekarang">Beli Sekarang</button>
        </div>
      `;
    } else {
      produkEl.innerHTML = `
        <img src="${p.gambar}" alt="${p.nama}" class="menu-card-img" />
        <h3 class="menu-card-title">${p.nama}</h3>
        <p class="menu-card-price">Rp ${Number(p.harga).toLocaleString("id-ID")}</p>
        <button type="button" class="btn-beli">Tambah ke Keranjang</button>
      `;
      const btn = produkEl.querySelector("button");
      if (btn) {
        btn.addEventListener("click", () => addToCart(p._id, p.nama, p.harga, p.gambar));
      }
    }
    container.appendChild(produkEl);
  });
}

// Fungsi tambah ke keranjang (dipakai di index.html)
function addToCart(id, nama, harga, gambar) {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const index = cart.findIndex((item) => item.id === id);

  if (index !== -1) {
    cart[index].qty += 1;
  } else {
    cart.push({ id, nama, harga, gambar, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert("Produk ditambahkan ke keranjang!");
}

// Fungsi pencarian produk
function cariProduk() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const hasilFilter = window.produkData.filter((p) =>
    p.nama.toLowerCase().includes(keyword)
  );
  tampilkanProduk(hasilFilter);
}
