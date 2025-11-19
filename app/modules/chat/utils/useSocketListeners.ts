import { useEffect } from "react";
import { useUser } from "@/app/modules/user/api/hooks";
import { useQueryClient } from "@tanstack/react-query";
import eventBus from "@/app/modules/common/untils/eventBus";
import { Message } from "@/app/modules/chat/types";
import {processIncomingMessage} from "@/app/modules/chat/utils/processIncomingMessage";

export const useSocketListeners = () => {
  const user = useUser();

  useEffect(() => {
    const handler = (msg: Message) => {
      if (!user?.data?.id) return;
      processIncomingMessage(msg, user.data.id);
    };

    eventBus.on("chat:message", handler);
    return () => {
      eventBus.off("chat:message", handler);
    };
  }, [user?.data?.id]);
};
