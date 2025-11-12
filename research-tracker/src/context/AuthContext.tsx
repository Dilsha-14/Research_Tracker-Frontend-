import React, { createContext, useState, useEffect, useCallback, ReactNode } from "react";
// ⚠ IMPORTANT: Check your package.json for the version!
// For jwt-decode v4+ use the named export; for v3 the default export exists.
import { jwtDecode } from "jwt-decode";

// Define a more specific type for your decoded token
type DecodedToken = {
  sub?: string;
  roles?: string[];
  exp?: number;
  [key: string]: any;
};

type AuthContextType = {
  user: DecodedToken | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DecodedToken | null>(null);

  // Wrap in useCallback so the function identity is stable
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  // Wrap in useCallback
  const login = useCallback((token: string) => {
    localStorage.setItem("token", token);
    try {
      // --- THIS IS THE FIX ---
      // Use the named jwtDecode and provide the generic type
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
    } catch {
      // If decoding fails, log out completely
      logout();
    }
  }, [logout]); // Add logout as a dependency

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // --- THIS IS THE FIX (applied here too) ---
        const decoded = jwtDecode<DecodedToken>(token);

        // If expired -> logout
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          logout();
        } else {
          setUser(decoded);
        }
      } catch {
        // Token is invalid or malformed
        logout();
      }
    }
  }, [logout]); // Add logout to dependency array

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};