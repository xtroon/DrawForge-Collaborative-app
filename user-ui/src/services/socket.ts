import { io } from 'socket.io-client';

// Connect to the backend server
const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ['polling', 'websocket'] // start with polling to prevent upgrade errors on Render
});
