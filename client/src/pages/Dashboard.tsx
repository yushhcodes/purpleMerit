import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { userApi } from '../api/userApi';
import { RoleBadge, StatusBadge } from '../components/Badges';
import type { User } from '../types/user';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, admins: 0, managers: 0, users: 0 });
  const [recent, setRecent] = useState<User[]>([]);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      userApi.getUsers({ limit: 5 }).then((data) => {
        setRecent(data.users);
        // compute simple stats from total
        setStats((prev) => ({ ...prev, total: data.total }));
      });
      // get active count
      userApi.getUsers({ status: 'active', limit: 1 }).then((d) => setStats((p) => ({ ...p, active: d.total })));
      userApi.getUsers({ status: 'inactive', limit: 1 }).then((d) => setStats((p) => ({ ...p, inactive: d.total })));
    }
  }, [user]);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Hello, {user?.name} — <RoleBadge role={user!.role} /></p>
        </div>
      </div>

      {(user?.role === 'admin' || user?.role === 'manager') && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.active}</div>
              <div className="stat-label">Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.inactive}</div>
              <div className="stat-label">Inactive</div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 style={{ fontSize: 15, fontWeight: 600 }}>Recent Users</h2>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 500 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td><RoleBadge role={u.role} /></td>
                      <td><StatusBadge status={u.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {user?.role === 'user' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div className="card-body">
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              You are signed in as a regular user. You can view and update your profile from the <strong>My Profile</strong> tab.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}