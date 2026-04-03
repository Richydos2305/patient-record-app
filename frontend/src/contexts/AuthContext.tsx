import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginCredentials, RegisterData, UpdateUserRequest } from '../types';
import { authApi } from '../services/api';
import axios from 'axios';

function extractErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: UpdateUserRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Module-level flag: prevents React StrictMode's double-invocation of useEffect
// from sending two simultaneous refresh requests with the same token.
let sessionRefreshAttempted = false;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('user');
      }
    }
    return null;
  });
  // Start loading if we have a refresh token to attempt silent re-auth
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('refreshToken'));

  // On mount: silently refresh credentials so returning users aren't forced to log in again
  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    // No token → nothing to refresh; isLoading was never set true so no state change needed.
    if (!refreshToken) return;
    // Already in flight (React StrictMode fires effects twice in dev) — let the
    // first request handle state; don't send a duplicate request.
    if (sessionRefreshAttempted) return;
    sessionRefreshAttempted = true;

    authApi.refresh(refreshToken)
      .then(({ accessToken, refreshToken: newRefreshToken }) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        // Fetch fresh user profile so state is up-to-date
        return authApi.getProfile();
      })
      .then((freshUser) => {
        localStorage.setItem('user', JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {
        // Refresh token is invalid/expired — clear everything and force login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const { accessToken, refreshToken, user: newUser } = await authApi.login(credentials);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Invalid credentials'));
    }
  };

  const register = async (data: RegisterData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword: _, ...payload } = data;
      const { accessToken, refreshToken, user: newUser } = await authApi.register(payload);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error(extractErrorMessage(error, 'Registration failed'));
    }
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken') ?? '';
    await authApi.logout(refreshToken);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = async (data: UpdateUserRequest) => {
    const updatedUser = await authApi.updateProfile(data);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
