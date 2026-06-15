import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { token, userName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', background: '#1C0A00', borderBottom: '1px solid #3E1F00' }}>
      <Link to="/dashboard" style={{ color: '#D4845A', fontWeight: 800, fontSize: '1.4rem', textDecoration: 'none', letterSpacing: '0.5px' }}>
        🔗 SnipURL
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {token ? (
          <>
            <span style={{ color: '#A0785A', fontSize: '0.9rem' }}>👋 {userName}</span>
            <button onClick={handleLogout} style={{ background: '#7B3F00', color: '#F5DEB3', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#A0785A', textDecoration: 'none', fontWeight: 500 }}>Login</Link>
            <Link to="/signup" style={{ color: '#A0785A', textDecoration: 'none', fontWeight: 500 }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}