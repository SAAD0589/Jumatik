require('dotenv').config();
const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  let users = [];
  const notifications = {};

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
    !notifications[userId] && (notifications[userId] = []);
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user?.socketId).emit("getMessage", {
      senderId,
      text,
    });
  });

  // notification send receive
  socket.on('sendNotification', ({type,
    recipient,
    sender,
    message }) => {
    notifications[recipient] = notifications[recipient] ?? [];
    notifications[recipient].push({ sender: socket.id, message, type });
    const receiver = getUser(recipient);
    io.to(receiver?.socketId).emit('receiveNotification', {recipient,
      sender,
      message,
      type
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});