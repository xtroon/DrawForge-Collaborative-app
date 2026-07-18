import { io } from 'socket.io-client';

// Connect to the backend server
const URL = 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: true,
});
