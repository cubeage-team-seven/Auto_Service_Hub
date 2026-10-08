import React, { createContext, useCallback, useEffect, useState } from "react";
import { getUser, login as authenticate, logout as clearSession } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser);

  const login = useCallback(async (username, password) => {
    const authenticatedUser = await authenticate(username, password);
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  useEffect(() => {
    const expireSession = () => setUser(null);
    window.addEventListener("autoservicehub:unauthorized", expireSession);
    return () => window.removeEventListener("autoservicehub:unauthorized", expireSession);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: Boolean(user) }}>
      {children}
    </AuthContext.Provider>
  );
}