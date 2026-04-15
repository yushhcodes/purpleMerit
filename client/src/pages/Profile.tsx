import { useEffect, useState } from 'react';
import { userApi } from '../api/userApi';
import type { User } from '../types/user';
import { RoleBadge, StatusBadge, formatDate } from '../components/Badges';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';

export default function Profile() {
  const [profile, setProfile] = useState<User | null>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    userApi.getMe().then(setProfile);
  }, []);

  const handleUpdate = async (payload: any) => {
    if (!profile) return;
    const updated = await userApi.updateUser(profile._id, payload);
    setProfile(updated);
    setShowEdit(false);
    setSuccess('Profile updated successfully.');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (!profile) return <div className="page" style={{ color: 'var(--text-secondary)' }}>Loading…</div>;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account information</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowEdit(true)}>Edit Profile</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card" style={{ maxWidth: 580 }}>
        <div className="card-body">
          <div className="profile-info">
            <div className="profile-avatar">{profile.name[0].toUpperCase()}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 17 }}>{profile.name}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{profile.email}</div>
            </div>
          </div>

          {[
            { label: 'Role', value: <RoleBadge role={profile.role} /> },
            { label: 'Status', value: <StatusBadge status={profile.status} /> },
            { label: 'Member Since', value: formatDate(profile.createdAt) },
            { label: 'Last Updated', value: formatDate(profile.updatedAt) },
            ...(profile.createdBy ? [{ label: 'Account Created By', value: `${profile.createdBy.name}` }] : []),
            ...(profile.updatedBy ? [{ label: 'Last Updated By', value: `${profile.updatedBy.name}` }] : []),
          ].map(({ label, value }) => (
            <div className="detail-row" key={label}>
              <span className="detail-label">{label}</span>
              <span className="detail-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {showEdit && (
        <Modal title="Edit Profile" onClose={() => setShowEdit(false)}>
          <UserForm user={profile} onSubmit={handleUpdate} onCancel={() => setShowEdit(false)} />
        </Modal>
      )}
    </div>
  );
}