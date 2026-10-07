import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { User } from "@/types/user";

const TOKEN_KEY = "user_token";
const USER_KEY = "user_data";

interface AuthContextData {
  user: User | null;
  token: string | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          SecureStore.getItemAsync(TOKEN_KEY),
          SecureStore.getItemAsync(USER_KEY),
        ]);

        if (!storedToken || !storedUser) {
          return;
        }

        const parsedUser = JSON.parse(storedUser) as User;

        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao carregar sessão:", error);

        await Promise.all([
          SecureStore.deleteItemAsync(TOKEN_KEY),
          SecureStore.deleteItemAsync(USER_KEY),
        ]);

        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    void loadSession();
  }, []);

  const login = useCallback(
    async (authenticatedUser: User, authenticationToken: string) => {
      await Promise.all([
        SecureStore.setItemAsync(TOKEN_KEY, authenticationToken),
        SecureStore.setItemAsync(
          USER_KEY,
          JSON.stringify(authenticatedUser),
        ),
      ]);

      setUser(authenticatedUser);
      setToken(authenticationToken);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);
    } finally {
      setUser(null);
      setToken(null);
    }
  }, []);

  const value = useMemo<AuthContextData>(
    () => ({
      user,
      token,

      isAuthenticated: Boolean(user && token),
      isLoading,

      login,
      logout,
    }),
    [user, token, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}