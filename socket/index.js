const socketio = require('socket.io');

module.exports = (server) => {
  const io = socketio(server);
  io.sockets.on('connection', (socket) => {
    let room;
    socket.on('room', (newRoom) => {
      room = newRoom;
      socket.join(room);
    });
    socket.on('message', () => {
      io.to(room).emit('message');
    });
  });
};
