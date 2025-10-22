import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import {useLogin} from "@/app/modules/auth/api/hooks";

export default function LoginScreen() {
  const { mutate } = useLogin();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      mutate({ email, password });
    } catch (err) {
      setError('Incorrect email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      {error ? <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text> : null}
      <Button title={loading ? 'Зачекайте...' : 'Увійти'} onPress={handleLogin} disabled={loading} />
    </View>
  );
}
