import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Admin from './pages/Admin';

function RequireAuth({ children, admin }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (admin && !user.isAdmin) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <header className="bar">
        <Link to="/" className="brand">Hearth</Link>
        <nav>
          <NavLink to="/">Shop</NavLink>
          <NavLink to="/cart">Cart{count > 0 && <span className="badge">{count}</span>}</NavLink>
          {user && <NavLink to="/orders">My orders</NavLink>}
          {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}
          {user ? (
            <button
              className="link"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Log out ({user.name})
            </button>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register">Create account</NavLink>
            </>
          )}
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>} />
          <Route path="/admin" element={<RequireAuth admin><Admin /></RequireAuth>} />
          <Route path="*" element={<p className="empty">Page not found. <Link to="/">Back to the shop</Link></p>} />
        </Routes>
      </main>
    </>
  );
}
