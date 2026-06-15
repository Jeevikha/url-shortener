import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Dashboard() {
  const [urls, setUrls] = useState([]);
  const [originalUrl, setOriginalUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [copied, setCopied] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchUrls(); }, []);

  const fetchUrls = async () => {
    try {
      const res = await API.get('/api/urls');
      setUrls(res.data);
    } catch {
      setError('Failed to load URLs');
    } finally {
      setFetching(false);
    }
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await API.post('/api/urls', { originalUrl });
      setUrls([res.data, ...urls]);
      setOriginalUrl('');
      setSuccess('Short URL created successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this URL?')) return;
    try {
      await API.delete('/api/urls/' + id);
      setUrls(urls.filter((u) => u._id !== id));
    } catch {
      setError('Failed to delete URL');
    }
  };

  const handleCopy = (shortUrl, id) => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#2C1200', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <h1 style={{ color: '#F5DEB3', fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          My Links
        </h1>

        {/* Shorten form */}
        <div style={{ background: '#1C0A00', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #3E1F00' }}>
          <h2 style={{ color: '#F5DEB3', marginBottom: '1rem', fontSize: '1.1rem' }}>Shorten a URL</h2>
          {error && (
            <div style={{ background: '#4A0000', color: '#FCA5A5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}
          {success && (
            <div style={{ background: '#1A3A00', color: '#86EFAC', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {success}
            </div>
          )}
          <form onSubmit={handleShorten} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              style={{ flex: 1, minWidth: '200px', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #3E1F00', background: '#2C1200', color: '#F5DEB3', fontSize: '1rem' }}
              placeholder="Paste your long URL here..."
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
            <button
              style={{ padding: '0.75rem 1.5rem', background: '#7B3F00', color: '#F5DEB3', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Shortening...' : '✂️ Shorten'}
            </button>
          </form>
        </div>

        {/* URL list */}
        {fetching ? (
          <p style={{ color: '#A0785A', textAlign: 'center', marginTop: '3rem' }}>Loading your links...</p>
        ) : urls.length === 0 ? (
          <p style={{ color: '#A0785A', textAlign: 'center', marginTop: '3rem' }}>No links yet. Create your first one above!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {urls.map((url) => (
              <div key={url._id} style={{ background: '#1C0A00', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', border: '1px solid #3E1F00' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#A0785A', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    🔗 {url.originalUrl.length > 50 ? url.originalUrl.slice(0, 50) + '...' : url.originalUrl}
                  </p>
                  <a href={url.shortUrl} target="_blank" rel="noreferrer" style={{ color: '#D4845A', fontWeight: 600, fontSize: '1rem', textDecoration: 'none' }}>
                    {url.shortUrl}
                  </a>
                  <div style={{ display: 'flex', gap: '1rem', color: '#6B4423', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                    <span>📅 {new Date(url.createdAt).toLocaleDateString()}</span>
                    <span>👆 {url.clicks} clicks</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleCopy(url.shortUrl, url._id)}
                    style={{ padding: '0.4rem 0.9rem', background: '#3E1F00', color: '#F5DEB3', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    {copied === url._id ? '✅ Copied!' : '📋 Copy'}
                  </button>
                  <button
                    onClick={() => navigate('/analytics/' + url._id)}
                    style={{ padding: '0.4rem 0.9rem', background: '#5C3317', color: '#F5DEB3', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    📊 Analytics
                  </button>
                  <button
                    onClick={() => handleDelete(url._id)}
                    style={{ padding: '0.4rem 0.9rem', background: '#7B0000', color: '#F5DEB3', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}