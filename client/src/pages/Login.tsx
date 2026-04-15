import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="login-page">
      <div className="card login-card fade-in">
        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>
        <div className="login-body">
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? <><span className="spinner" /> Signing in…</> : 'Sign in'}
            </button>
          </form>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, fontSize: 12, color: 'var(--text-secondary)' }}>
            <p style={{ fontWeight: 600, marginBottom: 6 }}>Demo credentials</p>
            <p>admin@example.com / admin123</p>
            <p>manager@example.com / manager123</p>
            <p>user@example.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
}