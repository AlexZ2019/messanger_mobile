import * as SecureStore from "expo-secure-store";
import { Chat, Message } from "../types";

export const loadMessages = async (chatId: string): Promise<Message[]> => {
  const raw = await SecureStore.getItemAsync(`chat_${chatId}`);
  return raw ? JSON.parse(raw) : [];
};

export const saveMessages = async (chatId: string, msgs: Message[]) => {
  await SecureStore.setItemAsync(`chat_${chatId}`, JSON.stringify(msgs));
};

export const saveMessage = async (chatId: string, msg: Message) => {
  const key = `chat_${chatId}`;
  const raw = await SecureStore.getItemAsync(key);
  const messages: Message[] = raw ? JSON.parse(raw) : [];

  if (!messages.some(m => m.id === msg.id)) {
    const updated = [...messages, msg];
    await SecureStore.setItemAsync(key, JSON.stringify(updated));
  }
};

export const getChatsList = async (): Promise<Chat[]> => {
  const raw = await SecureStore.getItemAsync("chatsList");
  return raw ? JSON.parse(raw) : [];
};

export const saveChatsList = async (list: Chat[]) => {
  await SecureStore.setItemAsync("chatsList", JSON.stringify(list));
};
