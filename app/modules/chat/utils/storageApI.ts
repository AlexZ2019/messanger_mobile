import * as SecureStore from "expo-secure-store";

export const getLocalChats = async () => {
  const localChats = await SecureStore.getItemAsync('chatsList')
  return localChats ? JSON.parse(localChats) : []
};