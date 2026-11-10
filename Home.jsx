import { useEffect, useState } from 'react';
import { api, rupees } from '../api';
import { useCart } from '../context/CartContext';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const { add, items } = useCart();

  useEffect(() => {
    api('/products/categories').then(setCategories).catch(() => {});
  }, []);

  // Re-fetch whenever search or category changes (small delay while typing)
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true);
      api(`/products?search=${encodeURIComponent(search)}&category=${encodeURIComponent(category)}`)
        .then((d) => {
          setProducts(d);
          setError('');
        })
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [search, category]);

  return (
    <>
      <section className="hero">
        <h1>Small things for a well-kept home.</h1>
        <p>Kitchen, home and desk goods, chosen to last.</p>
      </section>

      <div className="filters">
        <input
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="chips">
          {['All', ...categories].map((c) => (
            <button key={c} className={c === category ? 'chip on' : 'chip'} onClick={() => setCategory(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="error">Could not load products: {error}. Is the server running?</p>}
      {loading && !error && <p className="empty">Loading…</p>}
      {!loading && !error && products.length === 0 && (
        <p className="empty">No products found. Admins can add some on the Admin page, or run <code>npm run seed</code>.</p>
      )}

      <div className="grid">
        {products.map((p) => {
          const inCart = items.find((i) => i._id === p._id)?.qty || 0;
          return (
            <article key={p._id} className="card">
              <div className="thumb">{p.image ? <img src={p.image} alt={p.name} /> : p.name.slice(0, 1)}</div>
              <h3>{p.name}</h3>
              <p className="muted">{p.description}</p>
              <div className="row">
                <strong>{rupees(p.price)}</strong>
                <span className="muted">{p.stock > 0 ? `${p.stock} in stock` : 'Sold out'}</span>
              </div>
              <button disabled={p.stock === 0 || inCart >= p.stock} onClick={() => add(p)}>
                {p.stock === 0 ? 'Sold out' : inCart ? `Add another (${inCart} in cart)` : 'Add to cart'}
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}
