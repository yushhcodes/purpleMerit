export type UserRole = 'admin' | 'manager' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: { _id: string; name: string; email: string };
  updatedBy?: { _id: string; name: string; email: string };
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface PaginatedUsers {
  users: User[];
  total: number;
  page: number;
  pages: number;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
}