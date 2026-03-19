<div align="center">

<img src="public/logo.png" alt="Boucherie D'or Logo" width="220"/>

# Boucherie D'or — Premium Butcher E-Commerce

**A production-grade full-stack e-commerce platform built for a real butcher shop in Provence, France.**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)](https://clerk.dev)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://boucherie-d-or.vercel.app)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

### 🌐 [Live Demo](https://boucherie-d-or.vercel.app) &nbsp;·&nbsp; 📂 [Repository](https://github.com/NabilLamb/boucherie-D-or)

> *"Not just a portfolio project — a real product for a real business, built with production standards from day one."*

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Screenshots](#-screenshots)
3. [Key Features](#-key-features)
4. [Architecture](#-architecture)
5. [Tech Stack](#-tech-stack)
6. [Database Schema](#-database-schema)
7. [API Reference](#-api-reference)
8. [Performance & Optimizations](#-performance--optimizations)
9. [Security](#-security)
10. [Getting Started](#-getting-started)
11. [Environment Variables](#-environment-variables)
12. [What I Learned](#-what-i-learned)

---

## 🎯 Overview

**Boucherie D'or** is a full-stack e-commerce platform for a butcher shop in Camaret-sur-Aigues, France. It handles the complete customer journey — browsing, cart, checkout, order tracking, and PDF invoice downloads — alongside a full seller dashboard for product, category, and order management.

Built with **real business constraints**: no Stripe availability in Morocco (developer's location), seasonal offer management, authentic product photography, and real customer data.

### What separates this from a tutorial project

| | Typical Tutorial | This Project |
|--|--|--|
| **Auth** | Simple JWT | Clerk with role-based access |
| **Database** | SQLite / mock data | MongoDB Atlas — 40+ real products |
| **Payments** | Stripe copy-paste | Payment-processor-agnostic modal (Stripe unavailable in Morocco) |
| **Emails** | None | Nodemailer + Inngest background jobs |
| **Images** | Static files | Cloudinary CDN with auto WebP |
| **Data fetching** | Client-side waterfalls | Server Components + parallel `Promise.all` |
| **Deployment** | localhost | Vercel with GitHub CI/CD |
| **State** | One large context | Split contexts (Cart / Wishlist / App) |

### Demo Credentials

| Role | How to access |
|------|--------------|
| Customer | Sign up with any email |
| Admin | Contact for seller credentials |

**Demo card:** `4242 4242 4242 4242` · any future date · any CVV
> No real charges are made — this is a demo payment modal.

---

## 📸 Screenshots

### Full Homepage
<img src="public/screenshots/homepage.png" width="900" alt="Homepage"/>

---

### Customer Pages

<table>
  <tr>
    <td align="center" width="33%"><b>Product Detail</b></td>
    <td align="center" width="33%"><b>Cart</b></td>
    <td align="center" width="33%"><b>Favourites</b></td>
  </tr>
  <tr>
    <td><img src="public/screenshots/product-detail.png" width="280"/></td>
    <td><img src="public/screenshots/cart.png" width="280"/></td>
    <td><img src="public/screenshots/favories.png" width="280"/></td>
  </tr>
  <tr>
    <td align="center" colspan="3"><b>My Orders</b></td>
  </tr>
  <tr>
    <td colspan="3" align="center"><img src="public/screenshots/orders.png" width="600"/></td>
  </tr>
</table>

---

### Seller Dashboard

<table>
  <tr>
    <td align="center" width="50%"><b>Product Inventory + Analytics</b></td>
    <td align="center" width="50%"><b>Order Management</b></td>
  </tr>
  <tr>
    <td><img src="public/screenshots/seller/products.png" width="420"/></td>
    <td><img src="public/screenshots/seller/orders.png" width="420"/></td>
  </tr>
  <tr>
    <td align="center"><b>Category Management</b></td>
    <td align="center"><b>Customer Favourites Analytics</b></td>
  </tr>
  <tr>
    <td><img src="public/screenshots/seller/categories.png" width="420"/></td>
    <td><img src="public/screenshots/seller/Favorites.png" width="420"/></td>
  </tr>
  <tr>
    <td align="center"><b>Add Product</b></td>
    <td align="center"></td>
  </tr>
  <tr>
    <td><img src="public/screenshots/seller/addproduct.png" width="420"/></td>
    <td></td>
  </tr>
</table>

---

### 📱 Mobile Experience
<img src="public/screenshots/mobile.png" width="380" alt="Mobile Experience"/>

---

## ✨ Key Features

### Customer
- **Paginated product grid** with server-side search and category sidebar filter
- **Smart cart** — debounced 600ms API sync with local state for zero-flicker UX
- **Wishlist** — persistent favourites with heart toggle on every product card and detail page
- **Secure checkout** — payment modal with card brand detection (Visa/MC/Amex), expiry validation, and demo card hint
- **Order history** — full order timeline with expandable item details
- **PDF invoices** — one-click download via `@react-pdf/renderer`, works on all devices
- **Address management** — save and select delivery addresses with `react-hook-form`
- **Check-in codes** — auto-generated booking codes for in-store pickup

### Seller Dashboard
- **Product CRUD** — create, edit, delete with Cloudinary image upload (up to 4 images)
- **Category system** — dynamic types (`regular` / `offer` / `featured` / `banner`) that control which homepage section each product appears in
- **Order management** — status updates (Placed → Processing → Shipped → Completed → Cancelled) with date range filter
- **Analytics** — monthly sales trend charts, top-selling products, revenue stats (Chart.js)
- **Wishlist analytics** — see which products customers save most

### Homepage
- **Offer slider** — auto-playing hero slider for `offer` category products, pauses on hover
- **Featured section** — `featured` category products
- **Banner** — full-width promotional slider for `banner` category products
- **About Us** — brand story, craftsmanship gallery, team portraits
- **Contact** — form with email delivery + Google Maps embed
- **Footer** — live opening hours indicator (shows "Open Now" / "Closed" in real time)

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
│                                                             │
│  Navbar │ HomePage │ ProductPage │ Cart │ Orders │ Dashboard│
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           React Context Layer                        │   │
│  │   AppContext  │  CartContext  │  WishlistContext     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────┐
│                 NEXT.JS 15 APP ROUTER                       │
│                                                             │
│  Server Components          API Route Handlers              │
│  ┌──────────────────┐       ┌───────────────────────────┐   │
│  │ generateMetadata │       │ /api/products  (CRUD)     │   │
│  │ Parallel fetch   │       │ /api/cart      (CRUD)     │   │
│  │ notFound()       │       │ /api/order     (CRUD)     │   │
│  │ revalidate: 60   │       │ /api/categories(CRUD)     │   │
│  └──────────────────┘       │ /api/my-liked  (CRUD)     │   │
│                             │ /api/email/send(POST)     │   │
│                             │ /api/inngest   (HOOK)     │   │
│                             └───────────────────────────┘   │
└──────────┬─────────────────────┬────────────────┬───────────┘
           │                     │                │
  ┌────────▼───────┐   ┌──────────▼─────┐  ┌──────▼─────────┐
  │  MongoDB Atlas │   │   Cloudinary   │  │  Clerk Auth    │
  │                │   │   (Image CDN)  │  │  (Users/Roles) │
  │  products      │   │  Auto WebP     │  │  Middleware    │
  │  orders        │   │  Resize        │  │  publicMetadata│
  │  categories    │   │  CDN delivery  │  │  role: seller  │
  │  users         │   └────────────────┘  └────────────────┘
  │  addresses     │
  └────────┬───────┘
           │
  ┌────────▼─────────────────────────────────────────────────┐
  │                  INNGEST (Background Jobs)               │
  │                                                          │
  │  order.created → confirmation email (Nodemailer)         │
  │  order.created → generate check-in code                  │
  │  order.status.updated → status update email              │
  └──────────────────────────────────────────────────────────┘
```

### Order Placement Flow

```
User submits payment form
        │
        ▼
PaymentModal validates card locally
        │
        ▼
Simulates processing (2.2s)
        │
        ▼
onSuccess() fires
        │
        ▼
POST /api/order/create
  ├── Validates Clerk session
  ├── Locks productSnapshot (price immune to future changes)
  ├── Saves Order to MongoDB
  ├── Clears cart
  └── Fires Inngest event "order.created"
              │
              ▼
        Inngest worker
          ├── Sends confirmation email
          └── Generates check-in code
```

### Context Split — Why

```
Before: Single AppContext
  → Cart update → entire app re-renders (Navbar + all product cards)

After: 3 separate contexts
  CartContext     → only Cart page + CartIcon re-render
  WishlistContext → only Wishlist page + HeartIcon re-render
  AppContext       → only user/isSeller/currency (rarely changes)
```

### Category Type System

```
Category.type controls homepage section:

  "offer"    → HeaderSlider (hero offers carousel)
  "featured" → FeaturedProduct section
  "banner"   → Banner section
  "regular"  → HomeProducts grid only

To deactivate seasonal content (e.g. Ramadan Specials after Ramadan):
  Dashboard → Categories → Edit → change type from "offer" to "regular"
  → Disappears from homepage instantly, data preserved
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.2.6 | App Router, RSC, SSG/SSR |
| React | 19.0 | UI library |
| Tailwind CSS | 3.4 | Utility-first styling |
| Clerk | 6.12 | Auth + role management |
| react-hook-form | 7.54 | Forms + validation |
| axios | 1.7 | HTTP client |
| react-hot-toast | 2.5 | Toast notifications |
| Chart.js | 4.4 | Analytics charts |
| @react-pdf/renderer | 4.3 | PDF invoice generation |
| react-icons | 5.5 | Icon library |
| framer-motion | 12.6 | Animations |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 15.2.6 | REST endpoints |
| MongoDB / Mongoose | 8.10 | Database + ODM |
| Cloudinary | 2.5 | Image upload + CDN |
| Inngest | 3.31 | Background job queue |
| Nodemailer | 6.10 | Transactional emails |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Hosting + CI/CD from GitHub |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image CDN with auto WebP |
| Inngest Cloud | Serverless background jobs |

---

## 🗄️ Database Schema

```javascript
// Product
{
  name: String,
  description: String,
  price: Number,
  offerPrice: Number,       // optional sale price
  unit: String,             // "kg" | "piece" | "g"
  image: [String],          // Cloudinary URLs, max 4
  category: ObjectId,       // → Category
  userId: String,           // Clerk user ID
}

// Category
{
  name: String,
  type: String,             // "regular" | "offer" | "featured" | "banner"
}

// Order
{
  userId: String,
  items: [{
    productSnapshot: {      // ← price locked at purchase time
      name, price, offerPrice, unit, image
    },
    quantity: Number,
  }],
  amount: Number,
  address: ObjectId,        // → Address
  status: String,           // "Order Placed" | "Processing" | "Shipped" | "Completed" | "Cancelled"
  date: Number,
}

// Address
{
  userId: String,
  fullName: String,
  phoneNumber: String,
  area: String,
  city: String,
  state: String,
  zipcode: String,
}
```

> **Key decision:** `productSnapshot` locks product details at purchase time. Editing a product price never corrupts past order history.

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Public | Paginated + search + category filter |
| GET | `/api/products/:id` | Public | Single product |
| POST | `/api/products/add` | Seller | Create + Cloudinary upload |
| PUT | `/api/products/:id` | Seller | Update |
| DELETE | `/api/products/:id` | Seller | Delete |
| GET | `/api/products/offer` | Public | Offer category products |
| GET | `/api/products/featured` | Public | Featured category products |
| GET | `/api/products/banner` | Public | Banner category products |
| GET | `/api/categories` | Public | All categories |
| POST | `/api/categories` | Seller | Create category |
| PUT | `/api/categories/:id` | Seller | Update category |
| DELETE | `/api/categories/:id` | Seller | Delete category |
| GET | `/api/cart/get` | User | Get cart |
| POST | `/api/cart/update` | User | Update cart |
| POST | `/api/order/create` | User | Place order |
| GET | `/api/order/list` | User | Order history |
| GET | `/api/order/seller-orders` | Seller | All orders |
| PUT | `/api/order/update-status/:id` | Seller | Update status |
| POST | `/api/my-liked/create` | User | Add to wishlist |
| DELETE | `/api/my-liked/delete` | User | Remove from wishlist |
| GET | `/api/my-liked/list` | User | Get wishlist |
| POST | `/api/user/add-address` | User | Save address |
| GET | `/api/user/get-address` | User | Get addresses |
| POST | `/api/email/send` | Public | Contact form |

---

## ⚡ Performance & Optimizations

**Server-side parallel fetching**
```javascript
// No waterfall — both requests fire simultaneously
const [productRes, relatedRes] = await Promise.all([
  fetch(`/api/products/${id}`, { next: { revalidate: 60 } }),
  fetch(`/api/products?category=${categoryId}&exclude=${id}`),
]);
```

**Debounced cart sync**
```javascript
// Local state updates instantly (zero-flicker)
// API syncs after 600ms of inactivity (no unnecessary requests)
const debouncedSync = debounce(
  (items) => axios.post('/api/cart/update', { cartItems: items }),
  600
);
```

**Scroll performance**
```javascript
// requestAnimationFrame throttle — 60fps scroll handling
const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateNav);
    ticking = true;
  }
};
window.addEventListener("scroll", onScroll, { passive: true });
```

**React rendering**
- `React.memo` on `ProductCard` — 12 cards, only changed card re-renders
- `React.memo` on `FeaturedProduct` — never re-renders after initial load
- `useCallback` on all handlers passed to children
- `useSlider` custom hook isolates slider state

**Images**
- All images via Cloudinary CDN with auto WebP conversion
- Next.js `<Image>` with correct `sizes` on every component
- `priority` only on above-the-fold images
- `loading="lazy"` on carousel off-screen items

---

## 🔒 Security

- **Clerk** handles all auth — no custom JWT or session management
- Every protected route validates Clerk session via `currentUser()`
- Seller routes check `user.publicMetadata.role === "seller"`
- Server-side image validation (type + size) before Cloudinary upload
- `productSnapshot` pattern prevents price manipulation on past orders
- Updated to **Next.js 15.2.6** immediately after CVE-2025-66478 disclosure

---

## 🚀 Getting Started

```bash
# Clone
git clone https://github.com/NabilLamb/boucherie-D-or.git
cd boucherie-D-or

# Install
npm install

# Environment variables
cp .env.example .env.local
# Fill in values (see below)

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Variables

```bash
NEXT_PUBLIC_CURRENCY=€

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

# MongoDB
MONGODB_URI=mongodb+srv://...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Inngest
INNGEST_SIGNING_KEY=...
INNGEST_EVENT_KEY=...

# Email
SMTP_USER=...
SMTP_PASSWORD=...
CONTACT_EMAIL=...

# Company info (invoices + footer)
NEXT_PUBLIC_COMPANY_NAME=Boucherie D'or
NEXT_PUBLIC_COMPANY_ADDRESS=ZA Jonquier Morelle, Lavoisier Avenue, 84850 Camaret-sur-Aigues
NEXT_PUBLIC_COMPANY_PHONE=+33 4 90 62 49 06
NEXT_PUBLIC_COMPANY_EMAIL=contact.boucheriedor@gmail.com
NEXT_PUBLIC_BASE_URL=https://boucherie-d-or.vercel.app
```

---

## 👨‍💻 Author

**Nabil Lambattan** — Frontend Developer (React.js / Next.js)
📍 Oujda, Morocco &nbsp;·&nbsp; [LinkedIn](https://linkedin.com/in/nabil-lambattan) &nbsp;·&nbsp; [GitHub](https://github.com/NabilLamb)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

⭐ **If this project impressed you, a star on GitHub means a lot!**

</div>