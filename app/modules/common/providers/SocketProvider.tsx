import React, { createContext, useEffect, useRef } from 'react';
import { useUser } from '@/app/modules/user/api/hooks';
import { getSocket } from '@/app/modules/common/api/socket';
import eventBus from '@/app/modules/common/untils/eventBus';
import { Socket } from 'socket.io-client';
import { BaseProvider } from '@/app/modules/common/types';

export const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: BaseProvider) {
  const user = useUser();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.data?.id) return;

    const s = getSocket(user.data.id);
    socketRef.current = s;

    s.connect();

    s.on('message', (msg) => {
      eventBus.emit('chat:message', msg);
    });

    s.on('notification', (data) => {
      eventBus.emit('notifications:new', data);
    });

    return () => {
      s.off('message');
      s.off('notification');
      s.disconnect();
    };
  }, [user?.data?.id]);

  return <SocketContext.Provider value={socketRef.current}>{children}</SocketContext.Provider>;
}
