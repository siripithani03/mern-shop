import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => localStorage.setItem('cart', JSON.stringify(items)), [items]);

  const add = (p) =>
    setItems((cur) => {
      const found = cur.find((i) => i._id === p._id);
      if (found) return cur.map((i) => (i._id === p._id ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i));
      return [...cur, { _id: p._id, name: p.name, price: p.price, stock: p.stock, qty: 1 }];
    });
  const setQty = (id, qty) =>
    setItems((cur) =>
      cur.map((i) => (i._id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
    );
  const remove = (id) => setItems((cur) => cur.filter((i) => i._id !== id));
  const clear = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <CartContext.Provider value={{ items, add, setQty, remove, clear, count, total }}>
      {children}
    </CartContext.Provider>
  );
}
