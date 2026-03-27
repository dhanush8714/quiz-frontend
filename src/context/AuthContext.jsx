import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // ✅ FIXED

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // ✅ Login
  function login(data) {
    localStorage.setItem("user", JSON.stringify(data)); // ✅ FIXED
    setUser(data);
  }

  // ✅ Logout
  function logout() {
    localStorage.removeItem("user"); // ✅ FIXED
    setUser(null);
  }

  // 🔁 Refresh user after update
  function refreshUser() {
    const storedUser = localStorage.getItem("user"); // ✅ FIXED

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);