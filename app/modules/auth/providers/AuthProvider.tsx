import React, {createContext, useContext} from 'react';
import {useUser} from "@/app/modules/user/api/hooks";
import {BaseProvider} from "@/app/modules/common/types";
import {AuthContextValue} from "@/app/modules/auth/types";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<BaseProvider> = ({ children }) => {
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