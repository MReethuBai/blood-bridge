let ioInstance = null;

export function initSocketIO(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`⚡ Client connected: ${socket.id}`);

    // Join personal room
    socket.on('join_room', (data) => {
      const { userId, role } = data || {};
      if (userId) {
        socket.join(`user:${userId}`);
        console.log(`User ${userId} joined room user:${userId}`);
      }
      if (role) {
        socket.join(`role:${role}`);
        console.log(`Socket joined role room role:${role}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔥 Client disconnected: ${socket.id}`);
    });
  });
}

/**
 * Emit a real-time event to a specific user room
 */
export function emitToUser(userId, eventName, payload) {
  if (ioInstance) {
    ioInstance.to(`user:${userId}`).emit(eventName, payload);
  }
}

/**
 * Emit a real-time event to all hospital admins
 */
export function emitToHospitalAdmins(eventName, payload) {
  if (ioInstance) {
    ioInstance.to('role:hospitalAdmin').emit(eventName, payload);
  }
}

/**
 * Broadcast event to all connected clients
 */
export function broadcastEvent(eventName, payload) {
  if (ioInstance) {
    ioInstance.emit(eventName, payload);
  }
}
