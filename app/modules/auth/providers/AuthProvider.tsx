import React, { createContext, useContext } from 'react';
import {useUser} from "@/app/modules/user/api/hooks";

type User = { id: number; email: string; name?: string } | null;

interface AuthContextValue {
  user: User;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading } = useUser();

  return (
    <AuthContext.Provider value={{ user: data ?? null, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};