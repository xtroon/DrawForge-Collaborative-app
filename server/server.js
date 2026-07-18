require("dotenv").config();
const app = require("./src/app")

const connectToDB = require("./src/config/db")

connectToDB()

const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // allow all origins for dev
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

const roomUsers = {};

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('join-room', (data) => {
    // Check if data is string (old) or object (new)
    const roomId = typeof data === 'string' ? data : data.roomId;
    const user = typeof data === 'object' ? data.user : { name: "Guest" };
    
    socket.join(roomId);
    
    if (!roomUsers[roomId]) roomUsers[roomId] = [];
    // Remove if already exists to prevent dupes just in case
    roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
    roomUsers[roomId].push({ socketId: socket.id, user });
    
    io.to(roomId).emit('room-users', roomUsers[roomId]);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    if (roomUsers[roomId]) {
      roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
      io.to(roomId).emit('room-users', roomUsers[roomId]);
    }
    // Remove their cursor
    io.to(roomId).emit('cursor-disconnected', socket.id);
    console.log(`Socket ${socket.id} left room ${roomId}`);
  });

  socket.on('draw-shape', (data) => {
    // data should contain { roomId, shape }
    socket.to(data.roomId).emit('shape-drawn', data.shape);
  });

  socket.on('update-shapes', (data) => {
    // data should contain { roomId, shapes }
    socket.to(data.roomId).emit('shapes-updated', data.shapes);
  });

  socket.on('cursor-move', (data) => {
    socket.to(data.roomId).emit('cursor-moved', { 
      socketId: socket.id, 
      x: data.x, 
      y: data.y, 
      user: data.user 
    });
  });

  socket.on('disconnecting', () => {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.to(room).emit('cursor-disconnected', socket.id);
        if (roomUsers[room]) {
          roomUsers[room] = roomUsers[room].filter(u => u.socketId !== socket.id);
          io.to(room).emit('room-users', roomUsers[room]);
        }
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}...`);
});