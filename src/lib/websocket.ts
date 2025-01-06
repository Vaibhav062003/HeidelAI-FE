// lib/websocket.ts
import { io } from 'socket.io-client';

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WS_URL;

export const socket = io(WEBSOCKET_URL, {
  autoConnect: false,
});

export const connectWebSocket = () => {
  socket.connect();
  
  socket.on('connect', () => {
    console.log('Connected to WebSocket');
  });

  socket.on('new_message', (message) => {
    // Handle new message
  });

  return () => {
    socket.disconnect();
  };
};