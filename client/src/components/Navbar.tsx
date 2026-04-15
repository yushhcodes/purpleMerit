import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <span className="navbar-brand">UserManage</span>

      <div className="navbar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          Dashboard
        </NavLink>
        {(user?.role === 'admin' || user?.role === 'manager') && (
          <NavLink to="/users" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Users
          </NavLink>
        )}
        <NavLink to="/profile" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          My Profile
        </NavLink>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">{user?.name}</span>
        <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}