import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/api/auth/signup', form);
      login(res.data.token, res.data.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2C1200' }}>
      <div style={{ background: '#1C0A00', padding: '2.5rem', borderRadius: '16px', width: '100%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid #3E1F00' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🔗</span>
          <h2 style={{ color: '#F5DEB3', marginTop: '0.5rem', fontSize: '1.6rem' }}>Create account</h2>
          <p style={{ color: '#A0785A', fontSize: '0.9rem', marginTop: '0.25rem' }}>Start shortening links for free</p>
        </div>
        {error && <div style={{ background: '#4A0000', color: '#FCA5A5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            style={{ width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #3E1F00', background: '#2C1200', color: '#F5DEB3', fontSize: '1rem', boxSizing: 'border-box' }}
            placeholder="Full Name" type="text"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
          />
          <input
            style={{ width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #3E1F00', background: '#2C1200', color: '#F5DEB3', fontSize: '1rem', boxSizing: 'border-box' }}
            placeholder="Email" type="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required
          />
          <input
            style={{ width: '100%', padding: '0.75rem 1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #3E1F00', background: '#2C1200', color: '#F5DEB3', fontSize: '1rem', boxSizing: 'border-box' }}
            placeholder="Password" type="password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required
          />
          <button style={{ width: '100%', padding: '0.75rem', background: '#7B3F00', color: '#F5DEB3', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p style={{ color: '#A0785A', textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login" style={{ color: '#D4845A', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
}