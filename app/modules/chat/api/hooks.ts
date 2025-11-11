import {useMutation, useQueryClient} from "@tanstack/react-query";
import {chatApi} from "@/app/modules/chat/api/index";
import * as SecureStore from "expo-secure-store";

export const useChatMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn: (contactId: string) => chatApi.getChatId(contactId),
      onSuccess: async (data, contactId) => {
        const raw = await SecureStore.getItemAsync('chatsList');
        const chats = raw ? JSON.parse(raw) : [];
        // TODO: add type VV
        if (!chats.find((c: any)  => c.chatId === data.chatId)) {
          chats.push({ chatId: data.chatId, contactId, lastMessage: '', updatedAt: Date.now() });
          await SecureStore.setItemAsync('chatsList', JSON.stringify(chats));
        }
        queryClient.setQueryData(['chats'], chats);
      },
    }
  );
};