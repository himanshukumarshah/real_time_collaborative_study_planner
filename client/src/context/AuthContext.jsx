import React, { createContext, useState, useEffect, useContext } from "react";

/**
 * AuthContext contract:
 * - user: { id, name, email, ... } | null
 * - isAuthenticated: boolean
 * - login({ token, user }) -> stores token + user
 * - logout() -> clears storage + state
 * - initialized: boolean (restored from localStorage)
 */

export const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  initialized: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true); // mark initialization complete
  }, []);

  const login = ({ token, user: userPayload }) => {
    if (!token || !userPayload) return;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userPayload));
    setUser(userPayload);
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        initialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);