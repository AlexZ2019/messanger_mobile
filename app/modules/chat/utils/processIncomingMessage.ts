import {getChatsList, saveChatsList, saveMessage} from "@/app/modules/chat/utils/storageApI";
import {Chat, Message} from "@/app/modules/chat/types";
import {getContacts} from "@/app/modules/contacts/utils/storageApI";

export const upsertChatEntry = async (
  chatId: string,
  contactId: string,
  lastMessage: string,
) => {
  const chats: Chat[] = await getChatsList();

  const contacts = await getContacts();
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
};

export const processIncomingMessage = async (msg: Message, userId: string) => {
  await saveMessage(msg.chatId, msg);
  const otherId = msg.senderId === userId ? msg.receiverId : msg.senderId;
  await upsertChatEntry(msg.chatId, otherId, msg.text);
};
