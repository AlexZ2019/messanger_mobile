import * as SecureStore from "expo-secure-store";
import {getChatsList, saveChatsList, saveMessage} from "@/app/modules/chat/utils/storageApI";
import {Chat, Message} from "@/app/modules/chat/types";
import { Contact } from "../../contacts/types";
import {QueryClient} from "@tanstack/react-query";

export async function processIncomingMessage(msg: Message, userId: string, queryClient: QueryClient) {
  await saveMessage(msg.chatId, msg);

  const chats = await getChatsList();

  const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;

  const contactsRaw = await SecureStore.getItemAsync("contacts");
  const contacts = contactsRaw ? JSON.parse(contactsRaw) : [];
  const contact = contacts.find((c: Contact) => c.id === otherId);

  const contactName =
    contact?.localName ||
    contact?.nickname ||
    contact?.firstname ||
    "Unknown";

  const entry = {
    chatId: msg.chatId,
    contactId: otherId,
    contactName,
    lastMessage: msg.text,
    updatedAt: Date.now(),
  };

  const idx = chats.findIndex((c: Chat) => c.chatId === msg.chatId);
  if (idx >= 0) chats[idx] = entry;
  else chats.push(entry);

  await saveChatsList(chats);

  queryClient.setQueryData(["chats"], chats);
}
