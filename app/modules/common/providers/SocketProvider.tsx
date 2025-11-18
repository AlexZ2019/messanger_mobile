import React, { createContext, useEffect, useRef } from 'react';
import { useUser } from '@/app/modules/user/api/hooks';
import { getSocket } from '@/app/modules/common/api/socket';
import eventBus from "@/app/modules/common/untils/eventBus";

export const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const user = useUser();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user?.data?.id) return;

    const socket = getSocket(user.data.id);
    socketRef.current = socket;

    socket.connect();

    socket.on("message", (msg) => {
      eventBus.emit("chat:message", msg);
    });

    socket.on("notification", (data) => {
      eventBus.emit("notifications:new", data);
    });

    return () => {
      socket.off("message");
      socket.off("notification");
      socket.disconnect();
    };
  }, [user?.data?.id]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}
