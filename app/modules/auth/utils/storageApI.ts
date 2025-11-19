import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';

const DEVICE_ID_KEY = 'deviceId';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export async function getDeviceId(): Promise<string> {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = uuid.v4();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}

export const saveTokens = async (tokens: { accessToken: string; refreshToken: string }) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, tokens.accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const getRefreshToken = () => SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

export const getAccessToken = () => SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

export const getTokens = async (): Promise<{ accessToken: string | null; refreshToken: string | null }> => {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.getItemAsync(REFRESH_TOKEN_KEY),
  ]);
  return { accessToken, refreshToken };
};

export const clearTokens = async () => {
  await Promise.all([
    SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
  ]);
};
