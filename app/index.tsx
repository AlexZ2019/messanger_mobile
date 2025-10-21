import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {AuthProvider} from "@/app/modules/auth/context/UserContext";
import RootNavigator from "@/app/navigation/RootNavigator";

const queryClient = new QueryClient();

export default function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}
