export type UserRole = "ADMIN" | "OPERATOR";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name: string;
  email: string;
  password?: string;
}

export interface UpdateUserRoleData {
  role: UserRole;
}