import React, { createContext, useContext } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {authApi} from "@/app/modules/auth/api";

type User = { id: number; email: string; name?: string } | null;

interface AuthContextValue {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.me,
    retry: false,
  });

  const login = async (email: string, password: string) => {
    await authApi.login({ email, password });
    await refetch();
  };

  const logout = async () => {
    await authApi.logout();
    await queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{ user: (data ?? null) as User, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
