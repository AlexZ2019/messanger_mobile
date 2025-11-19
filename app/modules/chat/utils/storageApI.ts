import * as SecureStore from "expo-secure-store";
import {Chat, Message} from "../types";

export const loadMessages = async (chatId: string): Promise<Message[]> => {
  const raw = await SecureStore.getItemAsync(`chat_${chatId}`);
  return raw ? JSON.parse(raw) : [];
};

export const saveMessages = async (chatId: string, msgs: Message[]) => {
  await SecureStore.setItemAsync(`chat_${chatId}`, JSON.stringify(msgs));
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
