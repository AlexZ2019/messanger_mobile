import { io, Socket } from 'socket.io-client';
import {API_URL, API_PORT} from "@env";

let socket: Socket;

export const getSocket = (userId: string | undefined) => {
  if (!socket) {
    socket = io(`${API_URL}${API_PORT}`, {
      path: '/chat',
      transports: ['websocket'],
      autoConnect: false,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      if (userId) socket.emit('register', { userId });
    });

    socket.on('disconnect', (reason) => console.log('❌ Socket disconnected:', reason));
    socket.on('connect_error', (err) => console.error('❌ Connection error:', err));
  }
  return socket;
};
