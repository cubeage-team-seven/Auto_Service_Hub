import React, { createContext, useState, useCallback } from "react";
import { login as apiLogin, logout as apiLogout, getUser } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser);

  const login = useCallback(async (username, password) => {
    await apiLogin(username, password);
    setUser(getUser());
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
