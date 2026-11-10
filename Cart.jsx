import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, rupees } from '../api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, setQty, remove, clear, total } = useCart();
  const { user, token } = useAuth();
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const placeOrder = async () => {
    setBusy(true);
    setError('');
    try {
      await api('/orders', {
        method: 'POST',
        token,
        body: { address, items: items.map((i) => ({ product: i._id, qty: i.qty })) },
      });
      clear();
      setDone(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  if (done)
    return (
      <p className="empty">
        Order placed. Track it under <Link to="/orders">My orders</Link>.
      </p>
    );
  if (items.length === 0)
    return (
      <p className="empty">
        Your cart is empty. <Link to="/">Browse the shop</Link>
      </p>
    );

  return (
    <div className="panel wide">
      <h2>Your cart</h2>
      {items.map((i) => (
        <div className="line" key={i._id}>
          <span>{i.name}</span>
          <input type="number" min="1" max={i.stock} value={i.qty} onChange={(e) => setQty(i._id, Number(e.target.value))} />
          <span>{rupees(i.price * i.qty)}</span>
          <button className="link" onClick={() => remove(i._id)}>Remove</button>
        </div>
      ))}
      <div className="line total"><span>Total</span><span /><strong>{rupees(total)}</strong><span /></div>

      {user ? (
        <>
          <label>Delivery address
            <textarea rows="3" value={address} onChange={(e) => setAddress(e.target.value)} />
          </label>
          {error && <p className="error">{error}</p>}
          <button disabled={busy || !address.trim()} onClick={placeOrder}>
            {busy ? 'Placing order…' : 'Place order'}
          </button>
        </>
      ) : (
        <p className="muted"><Link to="/login">Log in</Link> to place your order.</p>
      )}
    </div>
  );
}
