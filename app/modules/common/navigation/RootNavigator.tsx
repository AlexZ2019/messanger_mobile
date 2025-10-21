import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import AppStack from './AppStack';
import AuthStack from '../../auth/stacks/AuthStack';
import { useAuth } from "@/app/modules/auth/context/UserContext";

export default function RootNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" animating={true} />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}
