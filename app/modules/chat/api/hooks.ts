import {useMutation} from "@tanstack/react-query";
import {chatApi} from "@/app/modules/chat/api/index";

export const useChatMutation = () => {
  return useMutation(
    {
      mutationFn: (contactId: string) => chatApi.getChatId(contactId),
    }
  );
};