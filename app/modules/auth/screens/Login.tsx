import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import {useAuth} from "@/app/modules/auth/context/UserContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login(String(email), String(password));
    } catch (err) {
      setError('Невірний email або пароль');
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
        autoCapitalize="none" // string — коректно
        keyboardType="email-address"
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Пароль"
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
