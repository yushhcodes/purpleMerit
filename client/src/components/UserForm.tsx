import { useState } from 'react';
import type { User, UserRole, UserStatus, CreateUserPayload, UpdateUserPayload } from '../types/user';
import { useAuthStore } from '../store/authStore';

interface Props {
  user?: User;
  onSubmit: (data: CreateUserPayload | UpdateUserPayload) => Promise<void>;
  onCancel: () => void;
}

export default function UserForm({ user, onSubmit, onCancel }: Props) {
  const { user: authUser } = useAuthStore();
  const isEdit = !!user;

  const [form, setForm] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
    role: user?.role ?? 'user',
    status: user?.status ?? 'active',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        const payload: UpdateUserPayload = { name: form.name, email: form.email };
        if (form.password) payload.password = form.password;
        if (authUser?.role === 'admin') {
          payload.role = form.role as UserRole;
          payload.status = form.status as UserStatus;
        }
        await onSubmit(payload);
      } else {
        await onSubmit({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role as UserRole,
          status: form.status as UserStatus,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="John Doe" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required placeholder="john@example.com" />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">{isEdit ? 'New Password (leave blank to keep)' : 'Password'}</label>
        <input className="form-input" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required={!isEdit} placeholder="Min 6 characters" minLength={6} />
      </div>

      {authUser?.role === 'admin' && (
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" value={form.role} onChange={(e) => set('role', e.target.value)}>
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spinner" /> : null}
          {isEdit ? 'Save Changes' : 'Create User'}
        </button>
      </div>
    </form>
  );
}