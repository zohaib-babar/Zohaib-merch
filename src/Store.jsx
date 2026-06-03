import { useState, useEffect, useCallback } from "react";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────
const ADMIN_CREDS = { username: "admin", password: "Password3388", name: "Admin" };

const INITIAL_PRODUCTS = [
  { id: 1, name: "Classic Black Tee", cat: "tshirt", price: 1299, stock: 45, emoji: "👕", badge: "Popular", desc: "Premium 100% cotton, ultra-soft and breathable. Perfect for everyday wear.", colors: ["#1a1a2e", "#e94560", "#ffffff"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 2, name: "Graphic Logo Tee", cat: "tshirt", price: 1499, stock: 30, emoji: "👕", badge: "New", desc: "Bold graphic print on premium cotton. Make a statement wherever you go.", colors: ["#ffffff", "#1a1a2e", "#3b82f6"], sizes: ["S", "M", "L", "XL"] },
  { id: 3, name: "Vintage Stripe Tee", cat: "tshirt", price: 1199, stock: 20, emoji: "👕", badge: "", desc: "Retro-inspired stripes on soft cotton blend. Timeless style for every season.", colors: ["#ffffff", "#6b7280"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 4, name: "Urban Fit Tee", cat: "tshirt", price: 1399, stock: 35, emoji: "👕", badge: "Sale", desc: "Slim-fit modern cut. Lightweight fabric for maximum comfort.", colors: ["#1a1a2e", "#065f46", "#7c3aed"], sizes: ["XS", "S", "M", "L", "XL"] },
  { id: 5, name: "Classic Pullover Hoodie", cat: "hoodie", price: 2999, stock: 25, emoji: "🧥", badge: "Bestseller", desc: "Cozy fleece-lined pullover. Perfect for cool evenings and lazy weekends.", colors: ["#1a1a2e", "#374151", "#e94560"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 6, name: "Zip-Up Oversized Hoodie", cat: "hoodie", price: 3499, stock: 15, emoji: "🧥", badge: "New", desc: "Trendy oversized fit with full zip. Premium heavyweight fleece inside.", colors: ["#f3f4f6", "#1a1a2e", "#7c3aed"], sizes: ["S", "M", "L", "XL"] },
  { id: 7, name: "Embroidered Logo Hoodie", cat: "hoodie", price: 3799, stock: 18, emoji: "🧥", badge: "Premium", desc: "Subtle embroidered Zohaib logo. Soft cotton-poly blend, regular fit.", colors: ["#1a1a2e", "#065f46", "#7c2d12"], sizes: ["S", "M", "L", "XL", "XXL"] },
  { id: 8, name: "Minimalist Hoodie", cat: "hoodie", price: 2799, stock: 22, emoji: "🧥", badge: "", desc: "Clean design, no fuss. Essential hoodie for your daily lineup.", colors: ["#6b7280", "#f3f4f6", "#1a1a2e"], sizes: ["XS", "S", "M", "L", "XL"] },
  { id: 9, name: "Coffee Boss Mug", cat: "mug", price: 799, stock: 60, emoji: "☕", badge: "Fun", desc: "11oz ceramic mug. Microwave & dishwasher safe. Perfect morning companion.", colors: ["#1a1a2e", "#ffffff", "#e94560"], sizes: [] },
  { id: 10, name: "Zohaib Signature Mug", cat: "mug", price: 999, stock: 40, emoji: "🍵", badge: "Popular", desc: "Premium 15oz signature mug. Bold branding, high-quality ceramic.", colors: ["#1a1a2e", "#e94560"], sizes: [] },
  { id: 11, name: "Motivational Quote Mug", cat: "mug", price: 849, stock: 55, emoji: "☕", badge: "New", desc: "Start your day inspired. Heat-reactive color-changing ceramic mug.", colors: ["#1a1a2e", "#ffffff"], sizes: [] },
  { id: 12, name: "Travel Tumbler Mug", cat: "mug", price: 1299, stock: 30, emoji: "🥤", badge: "", desc: "Stainless steel travel tumbler. Keeps drinks hot or cold for hours.", colors: ["#1a1a2e", "#6b7280", "#e94560"], sizes: [] },
];

const PKR = (n) => `PKR ${Number(n).toLocaleString()}`;
const getEmoji = (cat) => (cat === "tshirt" ? "👕" : cat === "hoodie" ? "🧥" : "☕");
const catLabel = (cat) => (cat === "tshirt" ? "T-Shirt" : cat === "hoodie" ? "Hoodie" : "Mug");
const catBg = (cat) => (cat === "mug" ? "#fef3c7" : cat === "hoodie" ? "#ede9fe" : "#dbeafe");
const statusClass = (s) => (s === "Delivered" ? "badge-success" : s === "Pending" ? "badge-warning" : s === "Cancelled" ? "badge-danger" : "badge-info");

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');

*{margin:0;padding:0;box-sizing:border-box;}
:root{
  --brand:#1a1a2e;--accent:#e94560;--accent2:#0f3460;--gold:#f5a623;
  --bg:#f8f7f4;--surface:#ffffff;--text:#1a1a2e;--muted:#6b7280;
  --border:#e5e7eb;--success:#10b981;--warning:#f59e0b;--danger:#ef4444;
  --radius:12px;--radius-sm:8px;--shadow:0 4px 24px rgba(26,26,46,0.08);
}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden;}
/* NAV */
nav{background:var(--brand);color:#fff;padding:0 16px;position:sticky;top:0;z-index:100;box-shadow:0 2px 20px rgba(0,0,0,0.2);}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:56px;}
.nav-logo{font-family:'Bebas Neue',cursive;font-size:22px;letter-spacing:2px;color:#fff;cursor:pointer;background:none;border:none;}
.nav-logo span{color:var(--accent);}
.nav-right{display:flex;align-items:center;gap:8px;}
.nav-btn{background:transparent;border:none;color:#fff;cursor:pointer;padding:8px;border-radius:var(--radius-sm);font-size:18px;position:relative;transition:background 0.2s;}
.nav-btn:hover{background:rgba(255,255,255,0.1);}
.cart-badge{position:absolute;top:2px;right:2px;background:var(--accent);color:#fff;font-size:9px;font-weight:600;width:16px;height:16px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.nav-avatar{width:32px;height:32px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;cursor:pointer;border:none;color:#fff;}
/* BUTTONS */
.btn{padding:11px 24px;border-radius:var(--radius-sm);font-size:14px;font-weight:600;cursor:pointer;border:none;transition:all 0.2s;font-family:'DM Sans',sans-serif;}
.btn-primary{background:var(--accent);color:#fff;}
.btn-primary:hover{background:#c73a52;transform:translateY(-1px);}
.btn-outline{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,0.4);}
.btn-outline:hover{background:rgba(255,255,255,0.1);}
.btn-sm{padding:8px 16px;font-size:13px;}
.btn-ghost{background:var(--bg);color:var(--muted);border:1px solid var(--border);}
.btn-block{width:100%;}
/* HERO */
.hero{background:linear-gradient(135deg,var(--brand) 0%,var(--accent2) 100%);color:#fff;padding:48px 16px 56px;text-align:center;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;top:-50%;right:-20%;width:400px;height:400px;background:var(--accent);opacity:0.06;border-radius:50%;}
.hero-tag{display:inline-block;background:var(--accent);color:#fff;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:16px;}
.hero h1{font-family:'Bebas Neue',cursive;font-size:48px;letter-spacing:3px;line-height:1;margin-bottom:8px;}
.hero h1 span{color:var(--accent);}
.hero p{color:rgba(255,255,255,0.75);font-size:14px;margin-bottom:24px;}
.hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;}
/* SEARCH */
.search-bar{display:flex;align-items:center;gap:8px;background:var(--surface);border:1.5px solid var(--border);border-radius:var(--radius-sm);padding:8px 14px;margin:12px 16px 0;}
.search-bar i{color:var(--muted);}
.search-bar input{border:none;background:transparent;outline:none;font-size:14px;flex:1;font-family:'DM Sans',sans-serif;}
/* SECTION */
.section{padding:32px 16px;}
.section-title{font-family:'Bebas Neue',cursive;font-size:28px;letter-spacing:2px;margin-bottom:4px;}
.section-sub{color:var(--muted);font-size:13px;margin-bottom:20px;}
.cat-pills{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px;}
.cat-pill{padding:8px 18px;border-radius:24px;font-size:13px;font-weight:500;cursor:pointer;border:1.5px solid var(--border);background:var(--surface);color:var(--text);transition:all 0.2s;}
.cat-pill.active{background:var(--brand);color:#fff;border-color:var(--brand);}
/* PRODUCT GRID */
.products-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
.product-card{background:var(--surface);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow);border:1px solid var(--border);transition:transform 0.2s;}
.product-card:hover{transform:translateY(-3px);}
.product-img{height:160px;display:flex;align-items:center;justify-content:center;font-size:60px;position:relative;}
.product-badge{position:absolute;top:8px;left:8px;background:var(--accent);color:#fff;font-size:9px;font-weight:700;letter-spacing:1px;padding:3px 8px;border-radius:4px;text-transform:uppercase;}
.wishlist-btn{position:absolute;top:8px;right:8px;background:rgba(255,255,255,0.9);border:none;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;transition:all 0.2s;}
.wishlist-btn.active{color:var(--accent);}
.product-body{padding:12px;}
.product-name{font-size:13px;font-weight:600;margin-bottom:2px;line-height:1.3;cursor:pointer;}
.product-cat{font-size:11px;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;}
.product-bottom{display:flex;align-items:center;justify-content:space-between;margin-top:8px;}
.product-price{font-size:16px;font-weight:700;color:var(--accent);}
.add-btn{width:30px;height:30px;background:var(--brand);color:#fff;border:none;border-radius:8px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s;}
.add-btn:hover{background:var(--accent);}
.stock-label{font-size:11px;margin-top:4px;}
/* BANNER */
.promo-banner{background:var(--brand);color:#fff;margin:0 16px;border-radius:var(--radius);padding:20px;display:flex;align-items:center;justify-content:space-between;gap:12px;}
.promo-banner h3{font-family:'Bebas Neue',cursive;font-size:22px;letter-spacing:1px;margin-bottom:4px;}
.promo-banner p{font-size:12px;color:rgba(255,255,255,0.7);}
/* CART DRAWER */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:200;}
.cart-drawer{position:fixed;right:0;top:0;bottom:0;width:320px;background:var(--surface);z-index:201;display:flex;flex-direction:column;box-shadow:-4px 0 24px rgba(0,0,0,0.15);}
.drawer-head{padding:16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.drawer-head h3{font-family:'Bebas Neue',cursive;font-size:22px;letter-spacing:1px;}
.close-btn{background:none;border:none;font-size:20px;cursor:pointer;color:var(--muted);}
.cart-items{flex:1;overflow-y:auto;padding:16px;}
.cart-item{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);}
.cart-item-img{width:56px;height:56px;background:var(--bg);border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;}
.cart-item-info{flex:1;}
.cart-item-name{font-size:13px;font-weight:600;margin-bottom:2px;}
.cart-item-price{font-size:13px;color:var(--accent);font-weight:600;}
.cart-item-qty{display:flex;align-items:center;gap:8px;margin-top:6px;}
.qty-btn{width:22px;height:22px;border:1px solid var(--border);background:var(--surface);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;}
.cart-footer{padding:16px;border-top:1px solid var(--border);}
.cart-total{display:flex;justify-content:space-between;margin-bottom:14px;}
.cart-total span{font-weight:600;font-size:16px;}
.empty-cart{text-align:center;padding:40px 16px;color:var(--muted);}
.empty-cart i{font-size:48px;margin-bottom:12px;display:block;}
/* MODAL */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px;}
.modal{background:var(--surface);border-radius:16px;width:100%;max-width:360px;padding:28px 24px;box-shadow:0 20px 60px rgba(0,0,0,0.2);max-height:90vh;overflow-y:auto;}
.modal h2{font-family:'Bebas Neue',cursive;font-size:28px;letter-spacing:1px;margin-bottom:4px;}
.modal p{color:var(--muted);font-size:13px;margin-bottom:20px;}
.modal-tabs{display:flex;border:1.5px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;margin-bottom:20px;}
.modal-tab{flex:1;padding:9px;text-align:center;font-size:13px;font-weight:600;cursor:pointer;background:transparent;border:none;font-family:'DM Sans',sans-serif;transition:background 0.2s;}
.modal-tab.active{background:var(--brand);color:#fff;}
/* FORM */
.form-group{margin-bottom:14px;}
.form-group label{display:block;font-size:12px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
.form-control{width:100%;padding:11px 14px;border:1.5px solid var(--border);border-radius:var(--radius-sm);font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s;background:var(--bg);}
.form-control:focus{border-color:var(--brand);}
.form-err{color:var(--danger);font-size:12px;margin-top:6px;}
textarea.form-control{resize:vertical;}
/* PRODUCT DETAIL */
.product-detail-img{height:200px;display:flex;align-items:center;justify-content:center;font-size:100px;background:var(--bg);border-radius:var(--radius);margin-bottom:16px;}
.size-selector{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 14px;}
.size-btn{width:40px;height:40px;border:1.5px solid var(--border);border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;background:var(--surface);display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
.size-btn.active{border-color:var(--brand);background:var(--brand);color:#fff;}
.color-selector{display:flex;gap:8px;margin:8px 0 14px;}
.color-dot{width:28px;height:28px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all 0.2s;}
/* WHY US */
.why-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px;}
.why-card{background:rgba(255,255,255,0.08);border-radius:var(--radius);padding:14px;text-align:center;}
/* ADMIN */
.admin-nav{background:var(--brand);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;}
.admin-nav h2{font-family:'Bebas Neue',cursive;font-size:22px;letter-spacing:1px;color:#fff;}
.admin-badge{background:var(--accent);color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;letter-spacing:1px;margin-left:8px;}
.admin-tabs{display:flex;border-bottom:2px solid var(--border);background:var(--surface);overflow-x:auto;}
.admin-tab{padding:14px 16px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap;border-bottom:2px solid transparent;margin-bottom:-2px;color:var(--muted);transition:all 0.2s;border:none;background:none;font-family:'DM Sans',sans-serif;}
.admin-tab.active{color:var(--brand);border-bottom:2px solid var(--accent);}
.admin-content{padding:16px;}
.stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:20px;}
.stat-card{background:var(--surface);border-radius:var(--radius);padding:16px;border:1px solid var(--border);box-shadow:var(--shadow);}
.stat-label{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;}
.stat-value{font-size:24px;font-weight:700;font-family:'Bebas Neue',cursive;letter-spacing:1px;}
.stat-sub{font-size:11px;color:var(--success);margin-top:2px;}
.admin-section{background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);overflow:hidden;margin-bottom:16px;}
.admin-section-head{padding:14px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.admin-section-head h3{font-size:15px;font-weight:600;}
.table-wrap{overflow-x:auto;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th{background:var(--bg);padding:10px 14px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--muted);}
td{padding:12px 14px;border-top:1px solid var(--border);}
.status-badge{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:600;padding:3px 8px;border-radius:12px;text-transform:uppercase;letter-spacing:0.5px;}
.badge-success{background:#d1fae5;color:#065f46;}
.badge-warning{background:#fef3c7;color:#92400e;}
.badge-danger{background:#fee2e2;color:#991b1b;}
.badge-info{background:#dbeafe;color:#1e40af;}
.product-row-img{width:36px;height:36px;border-radius:6px;background:var(--bg);display:flex;align-items:center;justify-content:center;font-size:20px;}
.action-btns{display:flex;gap:6px;}
.action-btn{padding:5px 10px;border-radius:6px;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all 0.2s;}
.action-btn-edit{background:#dbeafe;color:#1e40af;}
.action-btn-del{background:#fee2e2;color:#991b1b;}
/* PROFILE */
.profile-card{background:var(--surface);border-radius:var(--radius);padding:20px;border:1px solid var(--border);margin-bottom:16px;text-align:center;}
.profile-avatar{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--brand),var(--accent));display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;color:#fff;margin:0 auto 12px;border:none;}
.order-card{background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);overflow:hidden;margin-bottom:12px;}
.order-card-head{padding:12px 14px;background:var(--bg);display:flex;justify-content:space-between;align-items:center;}
.order-card-body{padding:14px;}
/* CHECKOUT */
.checkout-section{background:var(--surface);border-radius:var(--radius);border:1px solid var(--border);overflow:hidden;margin-bottom:16px;}
.checkout-section-head{padding:14px 16px;border-bottom:1px solid var(--border);}
.checkout-section-head h3{font-size:15px;font-weight:600;}
.checkout-section-body{padding:14px;display:grid;gap:10px;}
/* ORDER SUCCESS */
.order-success{text-align:center;padding:60px 20px;}
.order-success .check{font-size:80px;margin-bottom:16px;}
.order-success h2{font-family:'Bebas Neue',cursive;font-size:36px;margin-bottom:8px;}
/* FOOTER */
footer{background:var(--brand);color:rgba(255,255,255,0.7);padding:24px 16px;text-align:center;font-size:12px;margin-top:40px;}
footer strong{color:#fff;font-family:'Bebas Neue',cursive;font-size:18px;letter-spacing:2px;}
.footer-links{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin:12px 0;}
.footer-links button{color:rgba(255,255,255,0.6);font-size:12px;cursor:pointer;background:none;border:none;}
/* TOAST */
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--brand);color:#fff;padding:12px 20px;border-radius:var(--radius-sm);font-size:13px;font-weight:500;z-index:500;white-space:nowrap;box-shadow:0 4px 20px rgba(0,0,0,0.2);}
/* BREADCRUMB */
.breadcrumb{font-size:12px;color:var(--muted);padding:12px 16px;display:flex;align-items:center;gap:6px;}
.breadcrumb button{color:var(--muted);cursor:pointer;background:none;border:none;font-size:12px;}
/* UTILS */
.flex-between{display:flex;align-items:center;justify-content:space-between;}
.divider{border:none;border-top:1px solid var(--border);margin:16px 0;}
.select-control{width:100%;padding:8px 10px;border:1px solid var(--border);border-radius:6px;font-size:12px;font-family:'DM Sans',sans-serif;cursor:pointer;background:var(--surface);}
@media (max-width: 920px) {
  .nav-inner { flex-wrap: wrap; gap: 10px; }
  .nav-logo { font-size: 20px; }
  .hero { padding: 40px 14px 48px; }
  .hero h1 { font-size: 40px; }
  .hero p { font-size: 13px; }
  .hero-btns { flex-direction: column; align-items: stretch; }
  .hero-btns .btn { width: 100%; }
  .search-bar { margin: 12px 14px 0; }
  .section { padding: 28px 14px; }
  .products-grid { grid-template-columns: 1fr; }
  .cat-pills { justify-content: center; }
  .promo-banner { flex-direction: column; align-items: flex-start; text-align: left; }
  .promo-banner button { width: 100%; max-width: 260px; }
  .why-grid { grid-template-columns: 1fr; }
  .cart-drawer { width: 100%; max-width: 420px; }
  .modal { max-width: calc(100vw - 32px); }
  .admin-tabs { flex-wrap: wrap; gap: 8px; }
  .stats-grid { grid-template-columns: 1fr; }
  .admin-section-head { flex-direction: column; align-items: flex-start; gap: 10px; }
}
@media (max-width: 640px) {
  body { font-size: 14px; }
  .nav-inner { padding: 8px 0; }
  .nav-right { gap: 6px; }
  .hero { padding: 32px 12px 40px; }
  .hero h1 { font-size: 32px; letter-spacing: 1px; }
  .hero p { font-size: 13px; }
  .search-bar { margin: 10px 12px 0; }
  .section { padding: 22px 12px; }
  .product-img { height: 140px; }
  .product-body { padding: 14px; }
  .product-name { font-size: 14px; }
  .product-bottom { flex-direction: column; align-items: flex-start; gap: 10px; }
  .add-btn { width: 100%; }
  .product-price { font-size: 18px; }
  .promo-banner { padding: 18px; }
  .promo-banner h3 { font-size: 20px; }
  .why-card { padding: 16px; }
  .footer-links { flex-direction: column; gap: 8px; }
  .cart-drawer { width: 100%; max-width: none; }
  .modal { padding: 18px 16px; }
  .modal h2 { font-size: 24px; }
  .product-detail-img { height: 180px; font-size: 80px; }
  .checkout-section-body { display: grid; gap: 10px; }
  .order-card-head, .order-card-body { display: block; }
  .profile-card { padding: 18px; }
}
`;

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message }) {
  if (!message) return null;
  return <div className="toast">{message}</div>;
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function Navbar({ currentUser, cartCount, onLogoClick, onCartClick, onAuthClick, onProfileClick, onAdminClick, onSearchToggle }) {
  const initials = currentUser && !currentUser.isAdmin
    ? currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <nav>
      <div className="nav-inner">
        <button className="nav-logo" onClick={onLogoClick}>ZOHAIB<span>.</span>MERCH</button>
        <div className="nav-right">
          <button className="nav-btn" onClick={onSearchToggle} title="Search"><i className="fas fa-search" /></button>
          <button className="nav-btn" onClick={onCartClick} title="Cart">
            <i className="fas fa-shopping-bag" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          {!currentUser && <button className="nav-btn" onClick={onAuthClick} title="Login"><i className="fas fa-user" /></button>}
          {currentUser?.isAdmin && (
            <button className="nav-btn" onClick={onAdminClick} title="Admin Panel" style={{ color: "#f5a623" }}>
              <i className="fas fa-shield-alt" />
            </button>
          )}
          {currentUser && !currentUser.isAdmin && (
            <button className="nav-avatar" onClick={onProfileClick} title="My Profile">{initials}</button>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, wishlisted, onAddToCart, onToggleWishlist, onOpenDetail }) {
  return (
    <div className="product-card">
      <div className="product-img" style={{ background: catBg(product.cat) }}>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button
          className={`wishlist-btn${wishlisted ? " active" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
        >
          <i className={`${wishlisted ? "fas" : "far"} fa-heart`} />
        </button>
        <span style={{ fontSize: 60, cursor: "pointer" }} onClick={() => onOpenDetail(product.id)}>
          {product.emoji}
        </span>
      </div>
      <div className="product-body">
        <div className="product-cat">{catLabel(product.cat)}</div>
        <div className="product-name" onClick={() => onOpenDetail(product.id)}>{product.name}</div>
        <div className="product-bottom">
          <span className="product-price">{PKR(product.price)}</span>
          <button className="add-btn" onClick={() => onAddToCart(product.id)}><i className="fas fa-plus" /></button>
        </div>
        <div className="stock-label" style={{ color: product.stock < 10 ? "var(--danger)" : "var(--success)" }}>
          {product.stock < 10 ? `Only ${product.stock} left!` : "In Stock"}
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT GRID ─────────────────────────────────────────────────────────────
function ProductGrid({ products, wishlist, onAddToCart, onToggleWishlist, onOpenDetail }) {
  return (
    <div className="products-grid">
      {products.map(p => (
        <ProductCard
          key={p.id}
          product={p}
          wishlisted={wishlist.has(p.id)}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          onOpenDetail={onOpenDetail}
        />
      ))}
    </div>
  );
}

// ─── CART DRAWER ──────────────────────────────────────────────────────────────
function CartDrawer({ cart, isOpen, onClose, onUpdateQty, onRemove, onCheckout }) {
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose} />}
      {isOpen && (
        <div className="cart-drawer">
          <div className="drawer-head">
            <h3>Your Cart</h3>
            <button className="close-btn" onClick={onClose}><i className="fas fa-times" /></button>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <i className="fas fa-shopping-bag" />
                <p style={{ fontWeight: 600 }}>Your cart is empty</p>
                <p style={{ fontSize: 13, marginTop: 4 }}>Add some awesome products!</p>
              </div>
            ) : cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img">{item.emoji}</div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{PKR(item.price)}</div>
                  <div className="cart-item-qty">
                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, -1)}>−</button>
                    <span style={{ fontSize: 13, fontWeight: 500, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => onUpdateQty(item.id, 1)}>+</button>
                    <button onClick={() => onRemove(item.id)} style={{ marginLeft: "auto", background: "none", border: "none", color: "var(--danger)", cursor: "pointer" }}>
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cart.length > 0 && (
            <div className="cart-footer">
              <div className="cart-total"><span>Total</span><span>{PKR(total)}</span></div>
              <button className="btn btn-primary btn-block" onClick={onCheckout}>Proceed to Checkout</button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
function AuthModal({ isOpen, onClose, onLogin, onRegister }) {
  const [tab, setTab] = useState("login");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [regName, setRegName] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regErr, setRegErr] = useState("");

  if (!isOpen) return null;

  const handleLogin = () => {
    const result = onLogin(loginUser, loginPass);
    if (!result.ok) setLoginErr(result.msg);
    else setLoginErr("");
  };

  const handleRegister = () => {
    const result = onRegister(regName, regUser, regPass);
    if (!result.ok) setRegErr(result.msg);
    else setRegErr("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-tabs">
          <button className={`modal-tab${tab === "login" ? " active" : ""}`} onClick={() => setTab("login")}>Login</button>
          <button className={`modal-tab${tab === "register" ? " active" : ""}`} onClick={() => setTab("register")}>Register</button>
        </div>
        {tab === "login" ? (
          <>
            <h2>Welcome Back</h2>
            <p>Sign in to your account</p>
            <div className="form-group">
              <label>Username</label>
              <input className="form-control" placeholder="Enter username" value={loginUser} onChange={e => setLoginUser(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" placeholder="Enter password" value={loginPass} onChange={e => setLoginPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
              {loginErr && <div className="form-err">{loginErr}</div>}
            </div>
            <button className="btn btn-primary btn-block" onClick={handleLogin}>Sign In</button>
          </>
        ) : (
          <>
            <h2>Create Account</h2>
            <p>Join the Zohaib Merch family</p>
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" placeholder="Your full name" value={regName} onChange={e => setRegName(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input className="form-control" placeholder="Choose a username" value={regUser} onChange={e => setRegUser(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input className="form-control" type="password" placeholder="Create a password" value={regPass} onChange={e => setRegPass(e.target.value)} />
              {regErr && <div className="form-err">{regErr}</div>}
            </div>
            <button className="btn btn-primary btn-block" onClick={handleRegister}>Create Account</button>
          </>
        )}
        <button className="btn btn-ghost btn-block" style={{ marginTop: 12 }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

// ─── PRODUCT DETAIL MODAL ─────────────────────────────────────────────────────
function ProductDetailModal({ product, isOpen, onClose, onAddToCart }) {
  const [selSize, setSelSize] = useState(0);
  const [selColor, setSelColor] = useState(0);
  if (!isOpen || !product) return null;
  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: 400 }}>
        <div style={{ position: "relative" }}>
          <button className="close-btn" style={{ position: "absolute", top: 0, right: 0 }} onClick={onClose}><i className="fas fa-times" /></button>
          <div className="product-detail-img">{product.emoji}</div>
          <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "var(--muted)" }}>{catLabel(product.cat)}</span>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: "4px 0" }}>{product.name}</h2>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12 }}>{product.desc}</p>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>COLOR</div>
          <div className="color-selector">
            {product.colors.map((c, i) => (
              <div key={i} className="color-dot" style={{ background: c, borderColor: selColor === i ? "var(--text)" : "transparent" }} onClick={() => setSelColor(i)} />
            ))}
          </div>
          {product.sizes.length > 0 && (
            <>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", marginBottom: 6 }}>SIZE</div>
              <div className="size-selector">
                {product.sizes.map((s, i) => (
                  <div key={s} className={`size-btn${selSize === i ? " active" : ""}`} onClick={() => setSelSize(i)}>{s}</div>
                ))}
              </div>
            </>
          )}
          <div className="flex-between" style={{ margin: "14px 0 16px" }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>{PKR(product.price)}</span>
            <span style={{ fontSize: 12, color: product.stock < 10 ? "var(--danger)" : "var(--success)", fontWeight: 600 }}>{product.stock} in stock</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={() => { onAddToCart(product.id); onClose(); }}>Add to Cart 🛍️</button>
        </div>
        <button className="btn btn-ghost btn-block" style={{ marginTop: 12 }} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ products, wishlist, searchOpen, onAddToCart, onToggleWishlist, onOpenDetail, onShopNow, onSearchToggle }) {
  const [cat, setCat] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = products.filter(p => {
    const matchCat = cat === "all" || p.cat === cat;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const tshirts = products.filter(p => p.cat === "tshirt");
  const hoodies = products.filter(p => p.cat === "hoodie");
  const mugs = products.filter(p => p.cat === "mug");

  return (
    <div>
      {/* Hero */}
      <div className="hero">
        <span className="hero-tag">New Collection 2026</span>
        <h1>WEAR YOUR<br /><span>VIBE</span></h1>
        <p>Premium tees, cozy hoodies & statement mugs — exclusively crafted.</p>
        <div className="hero-btns">
          <button className="btn btn-primary" onClick={onShopNow}>Shop Now</button>
          <button className="btn btn-outline" onClick={() => document.getElementById("hoodies-section")?.scrollIntoView({ behavior: "smooth" })}>View Hoodies</button>
        </div>
      </div>

      {/* Search */}
      {searchOpen && (
        <div className="search-bar">
          <i className="fas fa-search" />
          <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
          <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }} onClick={() => { setSearch(""); onSearchToggle(); }}>
            <i className="fas fa-times" />
          </button>
        </div>
      )}

      {/* All Products */}
      <div className="section" id="products-section">
        <div className="flex-between" style={{ marginBottom: 12 }}>
          <div>
            <h2 className="section-title">Our Products</h2>
            <p className="section-sub">Handpicked styles for every occasion</p>
          </div>
        </div>
        <div className="cat-pills">
          {["all", "tshirt", "hoodie", "mug"].map(c => (
            <button key={c} className={`cat-pill${cat === c ? " active" : ""}`} onClick={() => setCat(c)}>
              {c === "all" ? "All" : c === "tshirt" ? "T-Shirts" : c === "hoodie" ? "Hoodies" : "Mugs"}
            </button>
          ))}
        </div>
        <ProductGrid products={filtered} wishlist={wishlist} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} onOpenDetail={onOpenDetail} />
      </div>

      {/* T-Shirts Section */}
      <div className="section">
        <h2 className="section-title">👕 T-Shirts</h2>
        <p className="section-sub">Fresh fits for every day</p>
        <ProductGrid products={tshirts} wishlist={wishlist} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} onOpenDetail={onOpenDetail} />
      </div>

      {/* Promo Banner */}
      <div className="promo-banner">
        <div>
          <h3>Buy 2 Get 20% Off!</h3>
          <p>Mix & match any products from our store</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={onShopNow}>Shop Now</button>
      </div>

      {/* Hoodies Section */}
      <div className="section" id="hoodies-section">
        <h2 className="section-title">🧥 Hoodies</h2>
        <p className="section-sub">Stay warm, stay stylish</p>
        <ProductGrid products={hoodies} wishlist={wishlist} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} onOpenDetail={onOpenDetail} />
      </div>

      {/* Mugs Section */}
      <div className="section">
        <h2 className="section-title">☕ Mugs</h2>
        <p className="section-sub">Start your day with style</p>
        <ProductGrid products={mugs} wishlist={wishlist} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} onOpenDetail={onOpenDetail} />
      </div>

      {/* Why Us */}
      <div className="section" style={{ background: "var(--brand)", margin: 0 }}>
        <h2 className="section-title" style={{ color: "#fff" }}>Why Choose Us?</h2>
        <div className="why-grid">
          {[["🚚", "Fast Delivery", "2-5 business days"], ["💎", "Premium Quality", "100% satisfaction"], ["🔄", "Easy Returns", "30-day policy"], ["🔒", "Secure Payment", "Safe & encrypted"]].map(([icon, title, sub]) => (
            <div className="why-card" key={title}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{icon}</div>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{title}</div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      <footer>
        <strong>ZOHAIB<span style={{ color: "var(--accent)" }}>.</span>MERCH</strong>
        <div className="footer-links">
          <button onClick={onShopNow}>Home</button>
          <button onClick={onShopNow}>T-Shirts</button>
          <button onClick={() => document.getElementById("hoodies-section")?.scrollIntoView({ behavior: "smooth" })}>Hoodies</button>
          <button onClick={onShopNow}>Mugs</button>
        </div>
        <p>© 2025 Zohaib Merchandise Store. All rights reserved.</p>
      </footer>
    </div>
  );
}

// ─── CHECKOUT PAGE ────────────────────────────────────────────────────────────
function CheckoutPage({ cart, currentUser, onBack, onPlaceOrder }) {
  const [name, setName] = useState(currentUser?.name || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState("");
  const [err, setErr] = useState("");
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const handlePlace = () => {
    if (!name || !phone || !address || !city || !payment) { setErr("Please fill all fields ⚠️"); return; }
    setErr("");
    onPlaceOrder({ name, phone, address: `${address}, ${city}`, payment, total });
  };

  return (
    <div>
      <div className="breadcrumb">
        <button onClick={onBack}><i className="fas fa-home" /></button>
        <span>/</span><span>Checkout</span>
      </div>
      <div style={{ padding: "0 16px 32px" }}>
        <h2 className="section-title">Checkout</h2>
        <div className="checkout-section" style={{ marginBottom: 12 }}>
          <div className="checkout-section-head"><h3>Order Summary</h3></div>
          <div style={{ padding: 14 }}>
            {cart.map(c => (
              <div key={c.id} className="flex-between" style={{ marginBottom: 8, fontSize: 14 }}>
                <span>{c.emoji} {c.name} x{c.qty}</span>
                <span style={{ fontWeight: 600 }}>{PKR(c.price * c.qty)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="checkout-section" style={{ marginBottom: 12 }}>
          <div className="checkout-section-head"><h3>Shipping Info</h3></div>
          <div className="checkout-section-body">
            <input className="form-control" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
            <input className="form-control" placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} />
            <input className="form-control" placeholder="Street Address" value={address} onChange={e => setAddress(e.target.value)} />
            <input className="form-control" placeholder="City" value={city} onChange={e => setCity(e.target.value)} />
            <select className="form-control" value={payment} onChange={e => setPayment(e.target.value)}>
              <option value="">Select Payment Method</option>
              {["Cash on Delivery", "JazzCash", "Easypaisa", "Bank Transfer"].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div style={{ background: "var(--surface)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: 14, marginBottom: 16 }}>
          <div className="flex-between" style={{ marginBottom: 12 }}><span style={{ fontSize: 14, color: "var(--muted)" }}>Subtotal</span><span style={{ fontWeight: 600, fontSize: 14 }}>{PKR(total)}</span></div>
          <div className="flex-between" style={{ marginBottom: 12 }}><span style={{ fontSize: 14, color: "var(--muted)" }}>Shipping</span><span style={{ fontWeight: 600, fontSize: 14, color: "var(--success)" }}>Free</span></div>
          <hr className="divider" />
          <div className="flex-between"><span style={{ fontWeight: 700, fontSize: 15 }}>Total</span><span style={{ fontWeight: 700, fontSize: 18, color: "var(--accent)" }}>{PKR(total)}</span></div>
        </div>
        {err && <div style={{ color: "var(--danger)", fontSize: 13, marginBottom: 12 }}>{err}</div>}
        <button className="btn btn-primary btn-block" style={{ fontSize: 15, padding: 14 }} onClick={handlePlace}>Place Order 🎉</button>
        <button className="btn btn-ghost btn-block" style={{ marginTop: 12 }} onClick={onBack}>Continue Shopping</button>
      </div>
    </div>
  );
}

// ─── ORDER SUCCESS ────────────────────────────────────────────────────────────
function OrderSuccessPage({ orderId, onContinue }) {
  return (
    <div className="order-success">
      <div className="check">🎉</div>
      <h2>Order Placed!</h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>Thank you for shopping with us.</p>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>
        Order #<span style={{ fontWeight: 700, color: "var(--brand)" }}>{orderId}</span>
      </p>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24, maxWidth: 280, margin: "0 auto 24px" }}>Our team will contact you soon to confirm your order.</p>
      <button className="btn btn-primary" onClick={onContinue}>Continue Shopping</button>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ currentUser, users, onBack, onLogout }) {
  const u = users.find(x => x.username === currentUser.username);
  const userOrders = u?.orders || [];
  const spent = userOrders.reduce((s, o) => s + o.total, 0);
  const initials = currentUser.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div>
      <div className="breadcrumb">
        <button onClick={onBack}><i className="fas fa-home" /></button>
        <span>/</span><span>My Profile</span>
      </div>
      <div style={{ padding: "0 16px 32px" }}>
        <div className="profile-card">
          <button className="profile-avatar">{initials}</button>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>{currentUser.name}</h3>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>@{currentUser.username}</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 14 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 700 }}>{userOrders.length}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>Orders</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 20, fontWeight: 700 }}>{PKR(spent)}</div><div style={{ fontSize: 11, color: "var(--muted)" }}>Spent</div></div>
          </div>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>My Orders</h3>
        {userOrders.length === 0 ? (
          <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", padding: 20 }}>No orders yet. Start shopping! 🛍️</p>
        ) : userOrders.map(o => (
          <div className="order-card" key={o.id}>
            <div className="order-card-head">
              <span style={{ fontWeight: 700, fontSize: 13 }}>Order #{o.id}</span>
              <span className={`status-badge ${statusClass(o.status)}`}>{o.status}</span>
            </div>
            <div className="order-card-body">
              <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>{o.date} · {o.payment}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--accent)" }}>{PKR(o.total)}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{o.items.map(i => `${i.emoji} ${i.name}`).join(", ")}</div>
            </div>
          </div>
        ))}
        <button className="btn btn-ghost btn-block" style={{ color: "var(--danger)", marginTop: 8 }} onClick={onLogout}>
          <i className="fas fa-sign-out-alt" /> Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage({ products, orders, users, onUpdateOrderStatus, onAddProduct, onEditProduct, onDeleteProduct, onLogout }) {
  const [tab, setTab] = useState("overview");
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({ name: "", cat: "tshirt", price: "", stock: "", desc: "", badge: "" });

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const catSales = { tshirt: 0, hoodie: 0, mug: 0 };
  orders.forEach(o => o.items.forEach(i => { if (catSales[i.cat] !== undefined) catSales[i.cat] += i.price * i.qty; }));
  const totalCatSales = Object.values(catSales).reduce((a, b) => a + b, 0) || 1;

  const handleEditClick = (p) => {
    setEditingProduct(p);
    setFormData({ name: p.name, cat: p.cat, price: p.price, stock: p.stock, desc: p.desc || "", badge: p.badge || "" });
    setTab("add-product");
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.stock) return;
    const productData = {
      ...formData,
      price: parseInt(formData.price),
      stock: parseInt(formData.stock),
      emoji: getEmoji(formData.cat),
      sizes: formData.cat !== "mug" ? ["S", "M", "L", "XL"] : [],
      colors: ["#1a1a2e", "#ffffff"],
    };
    if (editingProduct) {
      onEditProduct({ ...editingProduct, ...productData });
    } else {
      onAddProduct({ ...productData, id: Date.now() });
    }
    setEditingProduct(null);
    setFormData({ name: "", cat: "tshirt", price: "", stock: "", desc: "", badge: "" });
    setTab("products");
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setFormData({ name: "", cat: "tshirt", price: "", stock: "", desc: "", badge: "" });
    setTab("products");
  };

  const tabs = ["overview", "products", "orders", "users", "add-product"];
  const tabLabels = ["Overview", "Products", "Orders", "Users", "+ Add Product"];

  return (
    <div>
      <div className="admin-nav">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>Admin</h2>
          <span className="admin-badge">ADMIN</span>
        </div>
        <button className="btn btn-sm btn-primary" onClick={onLogout}>Logout</button>
      </div>
      <div className="admin-tabs">
        {tabs.map((t, i) => (
          <button key={t} className={`admin-tab${tab === t ? " active" : ""}`} onClick={() => { setTab(t); if (t !== "add-product") { setEditingProduct(null); setFormData({ name: "", cat: "tshirt", price: "", stock: "", desc: "", badge: "" }); } }}>
            {tabLabels[i]}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === "overview" && (
        <div className="admin-content">
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-label">Total Revenue</div><div className="stat-value" style={{ color: "var(--accent)" }}>{PKR(totalRevenue)}</div><div className="stat-sub">All time</div></div>
            <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-value">{orders.length}</div><div className="stat-sub">All time</div></div>
            <div className="stat-card"><div className="stat-label">Products</div><div className="stat-value">{products.length}</div><div className="stat-sub">In catalog</div></div>
            <div className="stat-card"><div className="stat-label">Customers</div><div className="stat-value">{users.length}</div><div className="stat-sub">Registered</div></div>
          </div>
          <div className="admin-section">
            <div className="admin-section-head"><h3>Sales by Category</h3></div>
            <div style={{ padding: 14, display: "grid", gap: 10 }}>
              {[{ cat: "T-Shirts", key: "tshirt", emoji: "👕", color: "#3b82f6" }, { cat: "Hoodies", key: "hoodie", emoji: "🧥", color: "#8b5cf6" }, { cat: "Mugs", key: "mug", emoji: "☕", color: "#f59e0b" }].map(c => {
                const pct = Math.round(catSales[c.key] / totalCatSales * 100);
                return (
                  <div key={c.key}>
                    <div className="flex-between" style={{ fontSize: 13, marginBottom: 4 }}>
                      <span>{c.emoji} {c.cat}</span>
                      <span style={{ fontWeight: 600 }}>{PKR(catSales[c.key])} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="admin-section">
            <div className="admin-section-head"><h3>Recent Orders</h3><span style={{ fontSize: 12, color: "var(--muted)" }}>Last 5</span></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Order #</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.slice(-5).reverse().map(o => (
                    <tr key={o.id}><td>#{o.id}</td><td>{o.customer}</td><td>{PKR(o.total)}</td><td><span className={`status-badge ${statusClass(o.status)}`}>{o.status}</span></td></tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", color: "var(--muted)", padding: 20 }}>No orders yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS */}
      {tab === "products" && (
        <div className="admin-content">
          <div className="admin-section">
            <div className="admin-section-head">
              <h3>All Products ({products.length})</h3>
              <button className="btn btn-sm btn-primary" onClick={() => setTab("add-product")}>+ Add</button>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Item</th><th>Name</th><th>Cat</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td><div className="product-row-img">{p.emoji}</div></td>
                      <td style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</td>
                      <td><span className="status-badge badge-info">{p.cat}</span></td>
                      <td>{PKR(p.price)}</td>
                      <td style={{ color: p.stock < 10 ? "var(--danger)" : "inherit", fontWeight: p.stock < 10 ? 700 : 400 }}>{p.stock}</td>
                      <td>
                        <div className="action-btns">
                          <button className="action-btn action-btn-edit" onClick={() => handleEditClick(p)}>Edit</button>
                          <button className="action-btn action-btn-del" onClick={() => { if (window.confirm("Delete this product?")) onDeleteProduct(p.id); }}>Del</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === "orders" && (
        <div className="admin-content">
          <div className="admin-section">
            <div className="admin-section-head"><h3>All Orders ({orders.length})</h3></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Items</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {orders.slice().reverse().map(o => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700 }}>#{o.id}</td>
                      <td>{o.customer}</td>
                      <td>{PKR(o.total)}</td>
                      <td>{o.items.length} item(s)</td>
                      <td><span className={`status-badge ${statusClass(o.status)}`}>{o.status}</span></td>
                      <td>
                        <select className="select-control" value={o.status} onChange={e => onUpdateOrderStatus(o.id, e.target.value)}>
                          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "var(--muted)", padding: 20 }}>No orders yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === "users" && (
        <div className="admin-content">
          <div className="admin-section">
            <div className="admin-section-head"><h3>Registered Users</h3></div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Username</th><th>Orders</th><th>Spent</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map(u => {
                    const spent = (u.orders || []).reduce((s, o) => s + o.total, 0);
                    return (
                      <tr key={u.id}>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>@{u.username}</td>
                        <td>{(u.orders || []).length}</td>
                        <td>{PKR(spent)}</td>
                        <td><span className="status-badge badge-info">Customer</span></td>
                      </tr>
                    );
                  })}
                  {users.length === 0 && <tr><td colSpan={5} style={{ textAlign: "center", color: "var(--muted)", padding: 20 }}>No registered users yet</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT PRODUCT */}
      {tab === "add-product" && (
        <div className="admin-content">
          <div className="admin-section">
            <div className="admin-section-head"><h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3></div>
            <div style={{ padding: 16, display: "grid", gap: 12 }}>
              {[
                { label: "Product Name", key: "name", type: "text", placeholder: "e.g. Classic Black Tee" },
                { label: "Price (PKR)", key: "price", type: "number", placeholder: "e.g. 1500" },
                { label: "Stock Quantity", key: "stock", type: "number", placeholder: "e.g. 50" },
                { label: "Badge (optional)", key: "badge", type: "text", placeholder: "e.g. New, Sale, Hot" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 5 }}>{f.label}</label>
                  <input className="form-control" type={f.type} placeholder={f.placeholder} value={formData[f.key]} onChange={e => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 5 }}>Category</label>
                <select className="form-control" value={formData.cat} onChange={e => setFormData(prev => ({ ...prev, cat: e.target.value }))}>
                  <option value="tshirt">T-Shirt</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="mug">Mug</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 5 }}>Description</label>
                <textarea className="form-control" rows={3} placeholder="Product description..." value={formData.desc} onChange={e => setFormData(prev => ({ ...prev, desc: e.target.value }))} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}>Save Product</button>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [nextOrderId, setNextOrderId] = useState(1001);
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [lastOrderId, setLastOrderId] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }, []);

  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const addToCart = (id) => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      return existing ? prev.map(c => c.id === id ? { ...c, qty: c.qty + 1 } : c) : [...prev, { ...p, qty: 1 }];
    });
    showToast(`${p.name} added to cart! 🛍️`);
  };

  const updateQty = (id, delta) => {
    setCart(prev => {
      const item = prev.find(c => c.id === id);
      if (!item) return prev;
      if (item.qty + delta <= 0) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c);
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(c => c.id !== id));

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); showToast("Removed from wishlist"); }
      else { next.add(id); showToast("Added to wishlist ❤️"); }
      return next;
    });
  };

  const doLogin = (username, password) => {
    if (username === ADMIN_CREDS.username && password === ADMIN_CREDS.password) {
      setCurrentUser({ ...ADMIN_CREDS, isAdmin: true });
      setAuthOpen(false);
      setPage("admin");
      showToast("Welcome back, Admin! 👑");
      return { ok: true };
    }
    const found = users.find(x => x.username === username && x.password === password);
    if (!found) return { ok: false, msg: "Invalid username or password" };
    setCurrentUser(found);
    setAuthOpen(false);
    showToast(`Welcome back, ${found.name}! 👋`);
    return { ok: true };
  };

  const doRegister = (name, username, password) => {
    if (!name || !username || !password) return { ok: false, msg: "All fields required" };
    if (users.find(x => x.username === username) || username === ADMIN_CREDS.username) return { ok: false, msg: "Username already taken" };
    const newUser = { id: Date.now(), name, username, password, orders: [], isAdmin: false };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setAuthOpen(false);
    showToast(`Account created! Welcome, ${name}! 🎉`);
    return { ok: true };
  };

  const doLogout = () => {
    setCurrentUser(null);
    setPage("home");
    showToast("Logged out successfully");
  };

  const handleCheckout = () => {
    if (!currentUser) { setCartOpen(false); setAuthOpen(true); showToast("Please login to checkout"); return; }
    setCartOpen(false);
    setPage("checkout");
  };

  const handlePlaceOrder = ({ name, phone, address, payment, total }) => {
    const oid = nextOrderId;
    const order = {
      id: oid, customer: currentUser.name, username: currentUser.username,
      items: [...cart], total, address, payment, status: "Pending", date: new Date().toLocaleDateString()
    };
    setOrders(prev => [...prev, order]);
    setUsers(prev => prev.map(u => u.username === currentUser.username ? { ...u, orders: [...(u.orders || []), order] } : u));
    setCart([]);
    setNextOrderId(oid + 1);
    setLastOrderId(oid);
    setPage("success");
    showToast("Order placed successfully! 🎉");
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    setUsers(prev => prev.map(u => ({ ...u, orders: (u.orders || []).map(o => o.id === id ? { ...o, status } : o) })));
    showToast(`Order #${id} marked as ${status}`);
  };

  const addProduct = (p) => { setProducts(prev => [...prev, p]); showToast("Product added! ✅"); };
  const editProduct = (p) => { setProducts(prev => prev.map(x => x.id === p.id ? p : x)); showToast("Product updated! ✅"); };
  const deleteProduct = (id) => { setProducts(prev => prev.filter(x => x.id !== id)); showToast("Product deleted"); };

  return (
    <>
      <style>{css}</style>
      <Navbar
        currentUser={currentUser}
        cartCount={cartCount}
        onLogoClick={() => setPage("home")}
        onCartClick={() => setCartOpen(true)}
        onAuthClick={() => setAuthOpen(true)}
        onProfileClick={() => setPage("profile")}
        onAdminClick={() => setPage("admin")}
        onSearchToggle={() => setSearchOpen(s => !s)}
      />

      {page === "home" && (
        <HomePage
          products={products}
          wishlist={wishlist}
          searchOpen={searchOpen}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          onOpenDetail={id => setDetailProduct(products.find(p => p.id === id))}
          onShopNow={() => { setPage("home"); setTimeout(() => document.getElementById("products-section")?.scrollIntoView({ behavior: "smooth" }), 50); }}
          onSearchToggle={() => setSearchOpen(s => !s)}
        />
      )}
      {page === "checkout" && (
        <CheckoutPage cart={cart} currentUser={currentUser} onBack={() => setPage("home")} onPlaceOrder={handlePlaceOrder} />
      )}
      {page === "success" && (
        <OrderSuccessPage orderId={lastOrderId} onContinue={() => setPage("home")} />
      )}
      {page === "profile" && currentUser && !currentUser.isAdmin && (
        <ProfilePage currentUser={currentUser} users={users} onBack={() => setPage("home")} onLogout={doLogout} />
      )}
      {page === "admin" && currentUser?.isAdmin && (
        <AdminPage
          products={products} orders={orders} users={users}
          onUpdateOrderStatus={updateOrderStatus}
          onAddProduct={addProduct} onEditProduct={editProduct} onDeleteProduct={deleteProduct}
          onLogout={doLogout}
        />
      )}

      <CartDrawer cart={cart} isOpen={cartOpen} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} onRemove={removeFromCart} onCheckout={handleCheckout} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} onLogin={doLogin} onRegister={doRegister} />
      <ProductDetailModal product={detailProduct} isOpen={!!detailProduct} onClose={() => setDetailProduct(null)} onAddToCart={addToCart} />
      <Toast message={toast} />
    </>
  );
}
