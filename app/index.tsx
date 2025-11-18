import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {AuthProvider} from "@/app/modules/auth/providers/AuthProvider";
import RootNavigator from "@/app/modules/common/navigation/RootNavigator";
import {SocketProvider} from "@/app/modules/common/providers/SocketProvider";

const queryClient = new QueryClient();

export default function Index() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <RootNavigator />
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
