# Hearth - MERN shop

Stack: **M**ongoDB, **E**xpress, **R**eact (Vite), **N**ode.js

Features: register / login (JWT + bcrypt), product list with search and categories,
cart (saved in the browser), checkout with stock check, order history,
and an admin page (add / edit / delete products, update order status).
No Mailgun, Google or AWS keys are needed.

## Run it (Node 20 or 22)

1. Edit `server/.env` and set `MONGO_URI` (local MongoDB or an Atlas link).
2. In the project folder:

```powershell
npm run install:all
npm run seed        # sample products + admin (admin@shop.com / admin123)
```

3. Terminal 1: `npm run server`   (should print "MongoDB connected")
4. Terminal 2: `npm run client`   then open http://localhost:5173

## Folder map

```
server/
  index.js          starts Express + connects MongoDB
  models/           User, Product, Order (Mongoose schemas)
  routes/           auth, products, orders (REST API)
  middleware/auth.js  checks the JWT, admin-only guard
  seed.js           sample data
client/src/
  App.jsx           navbar + routes
  api.js            fetch helper
  context/          AuthContext (login state), CartContext (cart state)
  pages/            Home, Login, Register, Cart, Orders, Admin
```
