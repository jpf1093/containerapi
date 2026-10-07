import type { User } from "@/types/user";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterOperatorData {
  name: string;
  email: string;
  password: string;
  role?: "OPERATOR";
}

export interface RegisterResponse {
  message: string;
  userId: number;
}