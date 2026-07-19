const roomUsers = {};

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-room', (data) => {
      const roomId = typeof data === 'string' ? data : data.roomId;
      const user = typeof data === 'object' ? data.user : { name: "Guest" };
      
      socket.join(roomId);
      
      // Initialize the room array if it doesn't exist yet
      if (!roomUsers[roomId]) {
        roomUsers[roomId] = [];
      }
      
      // Remove the user if they already exist to prevent duplicates (just in case!)
      roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
      
      // Add the new user to the room's list
      roomUsers[roomId].push({ socketId: socket.id, user });
      
      // Broadcast the updated list of users to everyone in the room
      io.to(roomId).emit('room-users', roomUsers[roomId]);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // When a user explicitly leaves a room
    socket.on('leave-room', (roomId) => {
      socket.leave(roomId);
      
      // If the room exists, remove the user from our tracking list
      if (roomUsers[roomId]) {
        roomUsers[roomId] = roomUsers[roomId].filter(u => u.socketId !== socket.id);
        // Send the updated list to everyone else in the room
        io.to(roomId).emit('room-users', roomUsers[roomId]);
      }
      
      // Tell other clients in the room to remove this user's cursor
      io.to(roomId).emit('cursor-disconnected', socket.id);
      console.log(`Socket ${socket.id} left room ${roomId}`);
    });


    socket.on('draw-shape', (data) => {
      // data should contain { roomId, shape }
      // Broadcast this shape to everyone ELSE in the room
      socket.to(data.roomId).emit('shape-drawn', data.shape);
    });

    // When the whole whiteboard state gets updated (like undo/redo or deleting)
    socket.on('update-shapes', (data) => {
      // data should contain { roomId, shapes }
      // Broadcast the new shapes array to everyone ELSE in the room
      socket.to(data.roomId).emit('shapes-updated', data.shapes);
    });

    // When a user moves their mouse/cursor
    socket.on('cursor-move', (data) => {
      // Broadcast the cursor coordinates to everyone ELSE so they can see the user's cursor moving live
      socket.to(data.roomId).emit('cursor-moved', { 
        socketId: socket.id, 
        x: data.x, 
        y: data.y, 
        user: data.user 
      });
    });

    // 'disconnecting' is fired just before the socket leaves all its rooms
    socket.on('disconnecting', () => {
      // Loop through all rooms this socket was part of
      for (const room of socket.rooms) {
        if (room !== socket.id) { // ignore the socket's default private room
          // Tell others to remove the cursor
          socket.to(room).emit('cursor-disconnected', socket.id);
          
          // Remove the user from our tracking list and notify the room
          if (roomUsers[room]) {
            roomUsers[room] = roomUsers[room].filter(u => u.socketId !== socket.id);
            io.to(room).emit('room-users', roomUsers[room]);
          }
        }
      }
    });

    // 'disconnect' is fired after the connection is completely closed
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

// Export the setup function so we can use it in server.js
module.exports = { initSocket };
