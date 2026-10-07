import { api } from "@/services/api";

import type {
  LoginData,
  LoginResponse,
  RegisterOperatorData,
  RegisterResponse,
} from "@/types/auth";

async function login(data: LoginData): Promise<LoginResponse> {
  return api.post<LoginResponse>("/api/auth/login", data);
}

async function registerOperator(
  data: RegisterOperatorData,
  token: string,
): Promise<RegisterResponse> {
  return api.post<RegisterResponse>(
    "/api/auth/register",
    {
      name: data.name,
      email: data.email,
      password: data.password,
      role: "OPERATOR",
    },
    token,
  );
}

export const authService = {
  login,
  registerOperator,
};