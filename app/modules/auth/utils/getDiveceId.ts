import * as SecureStore from 'expo-secure-store';
import uuid from 'react-native-uuid';

const DEVICE_ID_KEY = 'deviceId';

export async function getDeviceId(): Promise<string> {
  let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = uuid.v4();
    await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}
