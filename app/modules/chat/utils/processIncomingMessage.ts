import * as SecureStore from "expo-secure-store";
import { QueryClient } from "@tanstack/react-query";
import { getChatsList, saveChatsList, saveMessage } from "@/app/modules/chat/utils/storageApI";
import { Chat, Message } from "@/app/modules/chat/types";
import { Contact } from "@/app/modules/contacts/types";

export const upsertChatEntry = async (
  chatId: string,
  contactId: string,
  lastMessage: string,
  queryClient: QueryClient
) => {
  const chats: Chat[] = await getChatsList();

  const contactsRaw = await SecureStore.getItemAsync("contacts");
  const contacts: Contact[] = contactsRaw ? JSON.parse(contactsRaw) : [];
  const contact = contacts.find(c => c.id === contactId);
  const contactName = contact?.localName || contact?.nickname || contact?.firstname || "Unknown";

  const index = chats.findIndex(c => c.chatId === chatId);
  const entry: Chat = {
    chatId,
    contactId,
    localName: contactName,
    lastMessage,
    updatedAt: Date.now(),
  };

  if (index >= 0) chats[index] = entry;
  else chats.push(entry);

  await saveChatsList(chats);
  queryClient.setQueryData(["chats"], chats);
};

export const processIncomingMessage = async (msg: Message, userId: string, queryClient: QueryClient) => {
  await saveMessage(msg.chatId, msg);
  const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
  await upsertChatEntry(msg.chatId, otherId, msg.text, queryClient);
};
