# E-Commerce Platform

> A brand-driven, full-stack MERN e-commerce platform with real Stripe payments, role-based access, and DB-level query optimization.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![Stripe](https://img.shields.io/badge/Payments-Stripe-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🚀 Live Demo

- **Frontend**: [https://e-commerce-frontend.vercel.app](https://e-commerce-frontend.vercel.app)
- **Backend**: [https://ecommerce-api.onrender.com](https://ecommerce-api.onrender.com)

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@ecommerce.com` | `admin123` |
| User | `test@example.com` | `test123` |

### Stripe Test Card

| Field | Value |
|-------|-------|
| Card Number | `4242 4242 4242 4242` |
| Expiry | Any future date (e.g., `12/34`) |
| CVC | Any 3 digits (e.g., `123`) |
| ZIP | Any 5 digits (e.g., `12345`) |

> ⚠️ This uses Stripe **Test Mode** — no real money is charged.

---

## 📸 Screenshots

### Landing Page
Clean hero section with gradient backgrounds and feature highlights.

### Product Listing
4-column responsive grid with search, category filter, sort, and pagination — all powered by MongoDB queries.

### Admin Dashboard
Stats cards (revenue, orders, products, users), low stock alerts, and recent orders table.

---

## 🏗️ Architecture Overview

```
e-commerce/
├── server/                    # Express.js Backend
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Route handlers
│   │   ├── authController.js  # Register, Login, Logout, Me
│   │   ├── productController.js # CRUD + search/filter/sort/pagination
│   │   ├── orderController.js # Checkout + order history
│   │   └── adminController.js # Stats + order management
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT cookie verification
│   │   ├── adminMiddleware.js # Role-based access control
│   │   ├── errorMiddleware.js # Global error handler
│   │   └── rateLimiter.js     # Brute-force protection
│   ├── models/                # Mongoose schemas
│   │   ├── User.js            # bcrypt hashing, role enum
│   │   ├── Product.js         # Text + category indexes
│   │   └── Order.js           # Item snapshots, payment status
│   ├── routes/                # Express route definitions
│   ├── utils/stripeWebhook.js # Webhook signature verification
│   └── server.js              # Entry point
│
├── client/                    # React + Vite Frontend
│   ├── src/
│   │   ├── api/axios.js       # Configured Axios instance
│   │   ├── components/        # Reusable UI components
│   │   ├── context/AuthContext.jsx # Global auth state
│   │   ├── hooks/useDebounce.js   # Search optimization
│   │   ├── pages/             # Route pages
│   │   │   ├── admin/         # Admin-only pages
│   │   │   └── ...            # Public + user pages
│   │   └── App.jsx            # Router configuration
│   └── vite.config.js
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 (Vite), React Router v7, shadcn/ui, Tailwind CSS v4 |
| **Backend** | Node.js, Express 5, Mongoose 9 |
| **Database** | MongoDB Atlas |
| **Auth** | JWT (httpOnly cookies), bcrypt (12 rounds) |
| **Payments** | Stripe Checkout (Test Mode) + Webhooks |
| **Security** | Helmet, CORS, express-rate-limit, express-validator |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)
- Stripe account (free test mode)

### 1. Clone the repository
```bash
git clone https://github.com/uvenkatateja/e-commerce.git
cd e-commerce
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in `/server` (see `.env.example`):
```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ecommerce
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
CLIENT_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

### 4. Stripe Webhook (Local Testing)

Install the Stripe CLI and run:
```bash
stripe listen --forward-to localhost:5000/api/orders/webhook
```
Copy the webhook signing secret and add it to your `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login + set cookie |
| GET | `/api/auth/me` | Protected | Current user |
| POST | `/api/auth/logout` | Protected | Clear cookie |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Public | List (search, filter, sort, paginate) |
| GET | `/api/products/categories` | Public | Distinct categories |
| GET | `/api/products/:id` | Public | Single product |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

**Query parameters for GET /api/products:**
- `?search=keyword` — MongoDB `$text` search
- `?category=electronics` — Filter by category
- `?sort=price_asc|price_desc|newest|oldest` — Sort order
- `?page=1&limit=12` — Pagination

### Orders
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/orders/checkout` | User | Create Stripe session |
| GET | `/api/orders/my-orders` | User | Order history |
| POST | `/api/orders/webhook` | Stripe | Payment verification |

### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/admin/stats` | Admin | Dashboard stats |
| GET | `/api/admin/orders` | Admin | All orders |

---

## 🔒 Security Implementation

| Feature | Implementation |
|---------|---------------|
| Password Hashing | bcrypt with 12 salt rounds |
| Authentication | JWT stored in httpOnly cookie (XSS-proof) |
| HTTP Headers | Helmet middleware |
| Rate Limiting | 20 requests / 15 min on auth routes |
| CORS | Configured to allow only frontend URL |
| Input Validation | express-validator on all POST routes |
| Payment Security | Stripe webhook signature verification |

---

## ⚡ Performance Optimizations

| Optimization | Implementation | Why |
|-------------|----------------|-----|
| **Text Index** | MongoDB text index on `Product.title` | O(1) search vs O(n) regex scan |
| **Category Index** | Regular index on `Product.category` | Fast filter queries |
| **Lean Queries** | `.lean()` on all read queries | Returns plain JS objects, 3-5x faster |
| **Parallel Queries** | `Promise.all()` for count + find | Halves response time |
| **Debounced Search** | 300ms delay via `useDebounce` hook | Prevents API call per keystroke |
| **React.memo** | `ProductCard` wrapped with memo | Prevents unnecessary re-renders |
| **DB-level Ops** | All filter/sort/paginate in MongoDB | Server processes subset, not full dataset |

---

## 🧪 Stripe Payment Flow

```
User clicks "Buy Now"
    → POST /api/orders/checkout
    → Validate stock availability
    → Create Order (status: "pending")
    → Create Stripe Checkout Session
    → Return Stripe URL
    → Frontend redirects to Stripe hosted page
    → User enters test card (4242 4242 4242 4242)
    → Stripe processes payment
    → Stripe sends webhook to POST /api/orders/webhook
    → Backend verifies webhook signature
    → Mark order as "paid"
    → Deduct stock from products (atomic $inc)
    → User sees success page
```

**Critical**: Stock is ONLY deducted after webhook confirmation, never at checkout time. This prevents stock issues if users abandon checkout.

---

## 📝 License

MIT — Built for the MERN Assignment.
