module.exports = function(io) {
  io.on('connection', (socket) => {
    socket.on('videochaton', data => {
      console.log("______________________________________________________________________");
      io.emit('refreshvideo',{});
    });
  });
};
