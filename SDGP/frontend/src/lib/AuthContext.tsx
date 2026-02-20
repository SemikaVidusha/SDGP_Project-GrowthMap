import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Define types (Ensure file extension is .tsx)
interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  useEffect(() => {
    const storedUser = localStorage.getItem("growthmap_user");
    if (storedUser) {
      try {
        // Safety check: parse only if it's valid JSON
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from storage", error);
        localStorage.removeItem("growthmap_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem("growthmap_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("growthmap_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {/* Optional: Don't render children until we know if user is logged in */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};