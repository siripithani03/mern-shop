import { useEffect, useState } from 'react';
import { api, rupees } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api('/orders/mine', { token }).then(setOrders).catch((e) => setError(e.message));
  }, [token]);

  if (error) return <p className="error">{error}</p>;
  if (!orders) return <p className="empty">Loading…</p>;
  if (orders.length === 0) return <p className="empty">You have no orders yet.</p>;

  return (
    <div className="panel wide">
      <h2>My orders</h2>
      {orders.map((o) => (
        <div className="order" key={o._id}>
          <div className="row">
            <strong>{new Date(o.createdAt).toLocaleDateString()}</strong>
            <span className="tag">{o.status}</span>
          </div>
          {o.items.map((i, idx) => (
            <div className="muted" key={idx}>{i.qty} × {i.name}</div>
          ))}
          <div className="row"><span className="muted">{o.address}</span><strong>{rupees(o.total)}</strong></div>
        </div>
      ))}
    </div>
  );
}
