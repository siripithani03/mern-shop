import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="panel" onSubmit={submit}>
      <h2>Create account</h2>
      {error && <p className="error">{error}</p>}
      <label>Name<input required value={form.name} onChange={set('name')} /></label>
      <label>Email<input type="email" required value={form.email} onChange={set('email')} /></label>
      <label>Password (6+ characters)<input type="password" required minLength={6} value={form.password} onChange={set('password')} /></label>
      <button disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
      <p className="muted">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  );
}
