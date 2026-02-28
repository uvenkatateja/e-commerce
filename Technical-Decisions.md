# Technical Decisions — RudraX E-Commerce Platform

This document explains the architectural choices, design decisions, and tradeoffs made during the development of RudraX.

---

## 1. Authentication: httpOnly Cookie vs localStorage

### Decision: httpOnly Cookie

| Approach | XSS Protection | CSRF Risk | Setup Complexity |
|----------|---------------|-----------|-----------------|
| **httpOnly Cookie** ✅ | Immune — JS can't read it | Low (SameSite=Lax) | Moderate |
| localStorage | Vulnerable — any JS can read | None | Simple |

**Why**: Security was the priority. With httpOnly cookies, even if an attacker injects JavaScript into the page (XSS), they cannot steal the JWT token. The token is automatically sent with every request via the `credentials: 'include'` setting, and `SameSite=Lax` prevents CSRF attacks for JSON API calls.

**Tradeoff**: Requires `cookie-parser` on the backend, `withCredentials: true` on Axios, and proper CORS configuration. Slightly more setup, but significantly more secure.

---

## 2. Database Design: Item Snapshots in Orders

### Decision: Store product title and price at time of purchase inside the Order document

```javascript
items: [{
  productId: ObjectId,
  title: "Smart Watch",         // Snapshot
  quantity: 1,
  priceAtPurchase: 199.99       // Snapshot
}]
```

**Why**: If we only stored `productId` and populated it later, the order would break if:
- The product is deleted
- The product price changes
- The product title changes

By snapshotting `title` and `priceAtPurchase`, orders remain accurate forever, regardless of future product changes.

**Tradeoff**: Minor data duplication — worth it for data integrity.

---

## 3. Stock Deduction: Webhook-Only Approach

### Decision: Deduct stock ONLY after Stripe webhook confirms payment

**What we don't do**: Deduct stock when the user clicks "Buy Now" (at checkout creation time).

**Why**: If stock is deducted at checkout time and the user abandons the Stripe payment page, the stock is "lost" until someone manually restores it. Instead:

1. Checkout → validate stock → create Order (pending) → **no stock change**
2. Stripe confirms payment → webhook fires → **deduct stock atomically**

**Atomic operation**: We use MongoDB's `$inc` operator for stock deduction:
```javascript
await Product.findByIdAndUpdate(item.productId, {
  $inc: { stockQuantity: -item.quantity }
});
```
This is atomic — even if multiple webhooks fire simultaneously, the stock count remains accurate.

**Tradeoff**: There's a small window between checkout and payment where two users could both "claim" the last item. In a production app, we'd add a stock reservation system, but for this scale, the tradeoff is acceptable.

---

## 4. Stripe Webhook Raw Body

### Decision: Mount `express.raw()` BEFORE `express.json()` on the webhook route

```javascript
// server.js — order matters!
app.use("/api/orders/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
```

**Why**: Stripe's `constructEvent()` function verifies the webhook signature by hashing the raw request body. If `express.json()` parses it first, the body becomes a JavaScript object, the hash won't match, and **every webhook will fail silently**.

This is a common Stripe integration bug that's hard to debug because the checkout "works" but orders never get marked as paid.

---

## 5. DB-Level Query Operations

### Decision: All filtering, sorting, and pagination happen in MongoDB, not JavaScript

**Search**: Uses MongoDB `$text` index on `Product.title`
```javascript
filter.$text = { $search: searchTerm };
```

**Filter**: Direct query on indexed field
```javascript
filter.category = "electronics";
```

**Sort**: MongoDB sort operator
```javascript
.sort({ price: 1 }) // or { price: -1 }
```

**Pagination**: skip/limit
```javascript
.skip((page - 1) * limit).limit(limit)
```

**Why**: Frontend-only filtering loads ALL products into memory, then filters. With 10,000+ products, this causes:
- Massive bandwidth usage (sending all data to client)
- Slow page loads
- Poor mobile performance

DB-level queries only transfer the exact subset needed (e.g., 12 products per page).

---

## 6. Performance: Lean Queries

### Decision: Use `.lean()` on all read-only Mongoose queries

```javascript
const products = await Product.find(filter).lean();
```

**Why**: By default, Mongoose wraps query results in full Mongoose Document objects with change tracking, validation, getters/setters, and `save()` methods. `.lean()` returns plain JavaScript objects instead.

**Impact**: 3-5x faster for read operations, 50%+ less memory usage. Since we don't need to modify and save these documents, there's zero downside.

---

## 7. Frontend State Management: Context API vs Redux

### Decision: React Context API

**Why**: Our app has simple, predictable state requirements:
- Auth state (user object, login/logout functions)
- No complex cross-component state

Redux would add unnecessary complexity (actions, reducers, store configuration, middleware) for very little benefit. Context API provides exactly what we need.

**Tradeoff**: If the app grew to need features like optimistic updates, caching, or complex state machines, we'd migrate to Redux Toolkit or TanStack Query.

---

## 8. Password Hashing: 12 Salt Rounds

### Decision: bcrypt with 12 salt rounds (not 10, not 14)

| Rounds | Time per Hash | Security |
|--------|--------------|----------|
| 10 | ~65ms | Standard |
| **12** | **~250ms** | **Production-grade** |
| 14 | ~1000ms | Overkill, slow UX |

**Why**: 12 rounds provides strong brute-force protection while keeping registration/login under 500ms. Each additional round doubles the computation time, so 12 rounds is the production sweet spot.

---

## 9. Rate Limiting: Auth Routes Only

### Decision: Apply rate limiting to `/api/auth` routes (20 requests per 15 minutes)

**Why**: Auth routes are the highest-risk attack surface:
- Login: brute-force password guessing
- Register: spam account creation

Product and order routes are lower risk because they require authentication, and the JWT middleware already acts as a gatekeeper.

**Tradeoff**: We could rate-limit all routes, but this would hurt legitimate users browsing products rapidly. Selective rate limiting balances security and usability.

---

## 10. Debounced Search: 300ms Delay

### Decision: Frontend debounce on search input using a custom `useDebounce` hook

```javascript
const debouncedSearch = useDebounce(searchInput, 300);
```

**Why**: Without debounce, typing "headphones" fires 10 API calls (one per keystroke). With 300ms debounce, it fires 1-2 calls — the user pauses naturally between words.

**Why 300ms**: Research shows users perceive delays under 300ms as "instant." Longer delays (500ms+) feel sluggish. 300ms is the optimal balance.

---

## 11. Error Response Format: Standardized

### Decision: Every API response follows the same shape

```javascript
// Success
{ success: true, data: { ... } }

// Error
{ success: false, message: "..." }
```

**Why**: The frontend can use a single response handler pattern. No guessing whether to check `error.response.data.error` or `error.response.data.message` or `error.message`. Consistency eliminates an entire class of bugs.

---

## 12. What I Would Improve With More Time

1. **Image Upload**: Replace URL input with Cloudinary/S3 upload for product images
2. **Cart System**: Currently "Buy Now" is single-item. A proper cart with multi-item checkout would be better
3. **Email Notifications**: Send order confirmation emails via SendGrid/Resend
4. **Stock Reservation**: Temporarily reserve stock during checkout (TTL-based) to prevent overselling
5. **Testing**: Add Jest unit tests for controllers and React Testing Library for components
6. **Caching**: Add Redis caching for frequently accessed product queries
7. **Search**: Replace $text search with MongoDB Atlas Search (Elasticsearch-level features) or Algolia
8. **CI/CD**: Add GitHub Actions for automated testing and deployment
