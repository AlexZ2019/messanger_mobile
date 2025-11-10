import React from 'react';
import { View } from 'react-native'
import { TextInput, Button, Text } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useLogin } from '@/app/modules/auth/api/hooks';

const schema = yup.object({
  email: yup
    .string()
    .email('Некоректний email')
    .required('Введіть email'),
  password: yup
    .string()
    .min(6, 'Пароль має містити щонайменше 6 символів')
    .required('Введіть пароль'),
});

type LoginFormData = yup.InferType<typeof schema>;

const styles = {
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  error: { color: 'red', marginBottom: 10 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10 }
} as any //TODO: remove any

export default function LoginScreen() {
  const { mutate } = useLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Email"
            value={value}
            onChangeText={onChange}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              borderColor: errors.email ? 'red' : '#ccc',
              ...styles.input,
            }}
          />
        )}
      />
      {errors.email && (
        <Text style={styles.error}>
          {errors.email.message}
        </Text>
      )}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Password"
            value={value}
            onChangeText={onChange}
            secureTextEntry
            style={{
              borderColor: errors.password ? 'red' : '#ccc',
              ...styles.input,
            }}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>
          {errors.password.message}
        </Text>
      )}

      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Зачекайте...' : 'Увійти'}
      </Button>
    </View>
  );
}
