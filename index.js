const io = require("socket.io")(8000);
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    if (!name) {
      // Name is required; if not provided, return an error message to the client.
      socket.emit("error", "Name is required to join the chat.");
      return;
    }

    console.log("new user", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("typing", () => {
    socket.broadcast.emit("user-typing", users[socket.id]);
  });

  socket.on("stop-typing", () => {
    socket.broadcast.emit("user-stop-typing", users[socket.id]);
  });
  socket.on("disconnect", () => {
    const disconnectedUser = users[socket.id];
    if (disconnectedUser) {
      socket.broadcast.emit("left", disconnectedUser);
      delete users[socket.id];
    }
  });
});

