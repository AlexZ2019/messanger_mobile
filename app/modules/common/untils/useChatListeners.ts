import { useEffect } from "react";
import { useUser } from "@/app/modules/user/api/hooks";
import { useQueryClient } from "@tanstack/react-query";
import eventBus from "@/app/modules/common/untils/eventBus";
import {processIncomingMessage} from "@/app/modules/chat/utils/processIncomingMessage";
import { Message } from "../../chat/types";

export function useChatListeners() {
  const user = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = (msg: Message) => {
      if (!user?.data?.id) return;
      processIncomingMessage(msg, user.data.id, queryClient);
    };

    eventBus.on("chat:message", handler);

    return () => {
      eventBus.off("chat:message", handler);
    };
  }, [user?.data?.id]);
}
