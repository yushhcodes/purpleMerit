import { useEffect, useState, useCallback } from 'react';
import { userApi } from '../api/userApi';
import type { User } from '../types/user';
import { useAuthStore } from '../store/authStore';
import { RoleBadge, StatusBadge, formatDate } from '../components/Badges';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';

export default function UserList() {
  const { user: authUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userApi.getUsers({ search, role: roleFilter, status: statusFilter, page, limit: 10 });
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // debounce search
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleCreate = async (payload: any) => {
    await userApi.createUser(payload);
    setShowCreate(false);
    fetchUsers();
  };

  const handleEdit = async (payload: any) => {
    if (!editUser) return;
    await userApi.updateUser(editUser._id, payload);
    setEditUser(null);
    fetchUsers();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setActionLoading(true);
    setActionError('');
    try {
      await userApi.deleteUser(confirmDelete._id);
      setConfirmDelete(null);
      fetchUsers();
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Failed to deactivate user');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">{total} total users</p>
        </div>
        {authUser?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New User</button>
        )}
      </div>

      <div className="card">
        <div className="filters-row">
          <input
            className="form-input search-input"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <select className="form-select" style={{ width: 130 }} value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select className="form-select" style={{ width: 130 }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="table-wrap">
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-secondary)' }}>
              <span className="spinner" style={{ width: 20, height: 20 }} /> Loading…
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state"><p>No users found.</p></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td style={{ fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td><RoleBadge role={u.role} /></td>
                    <td><StatusBadge status={u.status} /></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewUser(u)}>View</button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditUser(u)}>Edit</button>
                        {authUser?.role === 'admin' && (
                          <button className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }} onClick={() => setConfirmDelete(u)}>
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pages > 1 && (
          <div className="pagination">
            <span className="pagination-info">Page {page} of {pages}</span>
            <div className="pagination-controls">
              <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
              <button className="btn btn-secondary btn-sm" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Create New User" onClose={() => setShowCreate(false)}>
          <UserForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editUser && (
        <Modal title={`Edit — ${editUser.name}`} onClose={() => setEditUser(null)}>
          <UserForm user={editUser} onSubmit={handleEdit} onCancel={() => setEditUser(null)} />
        </Modal>
      )}

      {/* View Modal */}
      {viewUser && (
        <Modal title="User Details" onClose={() => setViewUser(null)}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <div className="profile-avatar">{viewUser.name[0].toUpperCase()}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{viewUser.name}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{viewUser.email}</div>
              </div>
            </div>
            {[
              { label: 'Role', value: <RoleBadge role={viewUser.role} /> },
              { label: 'Status', value: <StatusBadge status={viewUser.status} /> },
              { label: 'Created', value: formatDate(viewUser.createdAt) },
              { label: 'Last Updated', value: formatDate(viewUser.updatedAt) },
              { label: 'Created By', value: viewUser.createdBy ? `${viewUser.createdBy.name} (${viewUser.createdBy.email})` : '—' },
              { label: 'Updated By', value: viewUser.updatedBy ? `${viewUser.updatedBy.name} (${viewUser.updatedBy.email})` : '—' },
            ].map(({ label, value }) => (
              <div className="detail-row" key={label}>
                <span className="detail-label">{label}</span>
                <span className="detail-value">{value}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Confirm Deactivate */}
      {confirmDelete && (
        <Modal
          title="Deactivate User"
          onClose={() => setConfirmDelete(null)}
          footer={
            <>
              {actionError && <span style={{ fontSize: 12, color: 'var(--danger)', marginRight: 'auto' }}>{actionError}</span>}
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={actionLoading}>
                {actionLoading ? <span className="spinner" /> : null} Deactivate
              </button>
            </>
          }
        >
          <p className="confirm-text">
            Are you sure you want to deactivate <strong>{confirmDelete.name}</strong>?
            They will no longer be able to log in.
          </p>
        </Modal>
      )}
    </div>
  );
}