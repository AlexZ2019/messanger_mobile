import {useMutation, useQueryClient} from "@tanstack/react-query";
import {chatApi} from "@/app/modules/chat/api/index";
import * as SecureStore from "expo-secure-store";

export const useChatMutation = () => {
  // const queryClient = useQueryClient();

  return useMutation(
    {
      mutationFn: (contactId: string) => chatApi.getChatId(contactId),
    }
  );
};