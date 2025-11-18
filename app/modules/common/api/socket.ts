import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.123.33:3001';
let socket: Socket;

export const getSocket = (userId?: string) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
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
