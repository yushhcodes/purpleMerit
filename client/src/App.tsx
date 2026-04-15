import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserList from './pages/UserList';
import Profile from './pages/Profile';

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Navbar />
      {children}
    </div>
  );
}

export default function App() {
  const { user } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppShell><Dashboard /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <AppShell><UserList /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <AppShell><Profile /></AppShell>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  );
}