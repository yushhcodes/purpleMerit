import type { UserRole, UserStatus } from '../types/user';

export function RoleBadge({ role }: { role: UserRole }) {
  return <span className={`badge badge-${role}`}>{role}</span>;
}

export function StatusBadge({ status }: { status: UserStatus }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}