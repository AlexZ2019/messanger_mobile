import * as SecureStore from "expo-secure-store";
import {Chat, Message} from "../types";

export const getLocalChats = async () => {
  const localChats = await SecureStore.getItemAsync('chatsList')
  return localChats ? JSON.parse(localChats) : []
};

export async function saveMessage(chatId: string, msg: Message) {
  const key = `chat_${chatId}`;

  const raw = await SecureStore.getItemAsync(key);
  const messages = raw ? JSON.parse(raw) : [];

  if (!messages.some((m: Message) => m.id === msg.id)) {
    const updated = [...messages, msg];
    await SecureStore.setItemAsync(key, JSON.stringify(updated));
  }
}

export async function getChatsList() {
  const raw = await SecureStore.getItemAsync("chatsList");
  return raw ? JSON.parse(raw) : [];
}

export async function saveChatsList(list: Chat[]) {
  await SecureStore.setItemAsync("chatsList", JSON.stringify(list));
}
