// auth context - global user state
import React, { createContext, useState, useContext, useEffect } from "react";
import {
  login as loginService,
  logout as logoutService,
  register as registerService,
  getCachedUser,
  User,
} from "../services/authService";

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // check auth on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const cachedUser = await getCachedUser();
      if (cachedUser) {
        setUser(cachedUser);
      }
    } catch (error) {
      console.error("błąd sprawdzania autoryzacji:", error);
    } finally {
      setLoading(false);
    }
  };

  // login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await loginService({ email, password });

      if (response.success) {
        setUser(response.user);
      } else {
        throw new Error(response.message || "Błąd logowania");
      }
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // register
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      setLoading(true);
      const response = await registerService({
        email,
        password,
        firstName,
        lastName,
      });

      if (!response.success) {
        throw new Error(response.message || "Błąd rejestracji");
      }

      // auto-login after registration
      await login(email, password);
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // logout
  const logout = async () => {
    try {
      setLoading(true);
      await logoutService();
      setUser(null);
    } catch (error) {
      console.error("błąd wylogowania:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export default AuthContext;
