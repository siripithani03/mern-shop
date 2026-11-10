import { useEffect, useState } from 'react';
import { api, rupees } from '../api';
import { useAuth } from '../context/AuthContext';

const blank = { name: '', description: '', price: '', category: '', image: '', stock: 10 };

export default function Admin() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const load = () => {
    api('/products').then(setProducts).catch((e) => setError(e.message));
    api('/orders', { token }).then(setOrders).catch((e) => setError(e.message));
  };
  useEffect(load, []);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      if (editing) await api(`/products/${editing}`, { method: 'PUT', token, body });
      else await api('/products', { method: 'POST', token, body });
      setForm(blank);
      setEditing(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const edit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, image: p.image, stock: p.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api(`/products/${id}`, { method: 'DELETE', token });
    load();
  };

  const setStatus = async (id, status) => {
    await api(`/orders/${id}/status`, { method: 'PUT', token, body: { status } });
    load();
  };

  return (
    <>
      <form className="panel wide" onSubmit={save}>
        <h2>{editing ? 'Edit product' : 'Add a product'}</h2>
        {error && <p className="error">{error}</p>}
        <div className="two">
          <label>Name<input required value={form.name} onChange={set('name')} /></label>
          <label>Category<input value={form.category} onChange={set('category')} placeholder="Kitchen" /></label>
          <label>Price (₹)<input type="number" min="0" required value={form.price} onChange={set('price')} /></label>
          <label>Stock<input type="number" min="0" value={form.stock} onChange={set('stock')} /></label>
        </div>
        <label>Image URL (optional)<input value={form.image} onChange={set('image')} /></label>
        <label>Description<textarea rows="2" value={form.description} onChange={set('description')} /></label>
        <div className="row">
          <button>{editing ? 'Save changes' : 'Add product'}</button>
          {editing && <button type="button" className="link" onClick={() => { setEditing(null); setForm(blank); }}>Cancel</button>}
        </div>
      </form>

      <div className="panel wide">
        <h2>Products ({products.length})</h2>
        {products.map((p) => (
          <div className="line admin" key={p._id}>
            <span>{p.name}</span>
            <span className="muted">{p.category}</span>
            <span>{rupees(p.price)} · {p.stock} left</span>
            <span>
              <button className="link" onClick={() => edit(p)}>Edit</button>
              <button className="link danger" onClick={() => del(p._id)}>Delete</button>
            </span>
          </div>
        ))}
      </div>

      <div className="panel wide">
        <h2>All orders ({orders.length})</h2>
        {orders.length === 0 && <p className="muted">No orders yet.</p>}
        {orders.map((o) => (
          <div className="order" key={o._id}>
            <div className="row">
              <strong>{o.user?.name} <span className="muted">({o.user?.email})</span></strong>
              <select value={o.status} onChange={(e) => setStatus(o._id, e.target.value)}>
                {['Placed', 'Packed', 'Shipped', 'Delivered'].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            {o.items.map((i, idx) => <div className="muted" key={idx}>{i.qty} × {i.name}</div>)}
            <div className="row"><span className="muted">{o.address}</span><strong>{rupees(o.total)}</strong></div>
          </div>
        ))}
      </div>
    </>
  );
}
