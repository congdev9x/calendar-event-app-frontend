"use client";

import { withToken } from "@/lib/api/zodios";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      setTokenState(saved);
      withToken(saved);
    }
    setIsLoading(false);
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
    } else {
      localStorage.removeItem("token");
    }
    withToken(newToken);
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
