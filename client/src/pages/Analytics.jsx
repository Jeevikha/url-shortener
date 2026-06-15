import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';

export default function Analytics() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get('/api/urls/' + id + '/analytics');
        setData(res.data);
      } catch {
        setError('Failed to load analytics');
      }
    };
    fetchAnalytics();
  }, [id]);

  if (error) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#ef4444' }}>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b' }}>Loading analytics...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '750px', margin: '0 auto' }}>

        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: '1px solid #334155', color: '#94a3b8', padding: '0.4rem 1rem', borderRadius: '6px', cursor: 'pointer', marginBottom: '1.5rem' }}>
          ← Back to Dashboard
        </button>

        <h1 style={{ color: '#f1f5f9', fontSize: '1.8rem', fontWeight: 800, marginBottom: '1.5rem' }}>📊 Analytics</h1>

        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Original URL</p>
          <a href={data.originalUrl} target="_blank" rel="noreferrer" style={{ color: '#94a3b8', fontSize: '0.95rem', wordBreak: 'break-all' }}>
            {data.originalUrl}
          </a>
          <p style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.25rem', marginTop: '0.75rem' }}>Short URL</p>
          <a href={data.shortUrl} target="_blank" rel="noreferrer" style={{ color: '#6366f1', fontWeight: 600 }}>
            {data.shortUrl}
          </a>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '150px', background: '#1e293b', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#6366f1', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{data.clicks}</p>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>Total Clicks</p>
          </div>
          <div style={{ flex: 1, minWidth: '150px', background: '#1e293b', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#6366f1', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{new Date(data.createdAt).toLocaleDateString()}</p>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>Created On</p>
          </div>
          <div style={{ flex: 1, minWidth: '150px', background: '#1e293b', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#6366f1', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{data.lastVisited ? new Date(data.lastVisited).toLocaleDateString() : 'Never'}</p>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>Last Visited</p>
          </div>
        </div>

        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ color: '#f1f5f9', marginBottom: '1rem', fontSize: '1.1rem' }}>Recent Visits</h2>
          {data.recentVisits.length === 0 ? (
            <p style={{ color: '#64748b' }}>No visits yet</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'left', padding: '0.5rem 1rem', borderBottom: '1px solid #334155' }}>#</th>
                  <th style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'left', padding: '0.5rem 1rem', borderBottom: '1px solid #334155' }}>Date</th>
                  <th style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'left', padding: '0.5rem 1rem', borderBottom: '1px solid #334155' }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {data.recentVisits.map((v, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#0f172a' : 'transparent' }}>
                    <td style={{ color: '#94a3b8', padding: '0.65rem 1rem', fontSize: '0.9rem' }}>{i + 1}</td>
                    <td style={{ color: '#94a3b8', padding: '0.65rem 1rem', fontSize: '0.9rem' }}>{new Date(v.visitedAt).toLocaleDateString()}</td>
                    <td style={{ color: '#94a3b8', padding: '0.65rem 1rem', fontSize: '0.9rem' }}>{new Date(v.visitedAt).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}