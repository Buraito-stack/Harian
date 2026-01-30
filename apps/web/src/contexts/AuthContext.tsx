import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthState, User, LoginCredentials, RegisterCredentials } from "../types";

// ============================================
// Auth Context - Real Authentication
// ============================================

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "harian_auth";
const API_BASE = "http://localhost:4000";

interface StoredAuth {
  user: User;
  token: string;
}

function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Invalid stored data
  }
  return null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize from storage and validate with server
  useEffect(() => {
    const validateSession = async () => {
      const stored = getStoredAuth();
      if (!stored) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Validate token with server
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${stored.token}` },
        });

        if (res.ok) {
          const { data } = await res.json();
          // Update stored user with fresh data from server
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...stored, user: data.user }));
          setState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Token invalid, clear storage
          localStorage.removeItem(STORAGE_KEY);
          setState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } catch {
        // Server unreachable, use stored data
        setState({
          user: stored.user,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    };

    validateSession();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    // Don't set isLoading here - it causes the login form to unmount and lose data

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      let json;
      try {
        json = await res.json();
      } catch {
        throw new Error("Server error");
      }

      if (!res.ok) {
        throw new Error(json.error || "Email atau password salah");
      }

      const { data } = json;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const json = await res.json();

      if (!res.ok) {
        setState((prev) => ({ ...prev, isLoading: false }));
        throw new Error(json.error || "Registration failed");
      }

      const { data } = json;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    const stored = getStoredAuth();
    
    // Notify server (fire and forget)
    if (stored?.token) {
      fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${stored.token}` },
      }).catch(() => {});
    }

    localStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const updateUser = useCallback((data: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, ...data };
      const stored = getStoredAuth();
      if (stored) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...stored, user: updatedUser })
        );
      }
      return { ...prev, user: updatedUser };
    });
  }, []);

  const isAdmin = state.user?.role === "admin";

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      register,
      logout,
      updateUser,
      isAdmin,
    }),
    [state, login, register, logout, updateUser, isAdmin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
