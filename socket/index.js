require('dotenv').config()

const io = require("socket.io")(process.env.PORT, {
  cors: {
    origin: "http://localhost:3000",
  },
});


let users = [];

const addUser = (newUser, socketId) => {
  !users.some((user) => user.id === newUser.id) &&
    users.push({ ...newUser, socketId });
};

const getUsers = (receivers) => {
  return users.filter((user) =>
    receivers.find((receiver) => receiver === user.id)
  );
};

io.on("connection", (socket) => {
  socket.on("addUser", (user) => {
    addUser(user, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("typing", ({ sender, chatId, receivers }) => {
    const gotUses = getUsers(receivers);
    io.to(gotUses.map((user) => user.socketId)).emit("getTyping", {
      sender,
      chatId,
    });
  });

  socket.on('submitRound', ({receivers}) => {
    const gotUses = getUsers(receivers);
    io.to(gotUses.map((user) => user.socketId)).emit("getSubmitRound", {});
  })

  socket.on("stopTyping", ({ sender, chatId, receivers }) => {
    const gotUses = getUsers(receivers);
    io.to(gotUses.map((user) => user.socketId)).emit("getStopTyping", {});
  });

  // send and get message
  socket.on(
    "sendMessage",
    ({ id, sender, receivers, text, createdAt, chatId }) => {
      const gotUses = getUsers(receivers);
      io.to(gotUses.map((user) => user.socketId)).emit("getMessage", {
        id,
        sender,
        text,
        createdAt,
        chatId,
      });
    }
  );

  socket.on("newRound", ({ previousWinner, gameId, receivers, round }) => {
    const gotUses = getUsers(receivers);
    console.log("new round users", gotUses);
    io.to(gotUses.map((user) => user.socketId)).emit("getNewRound", {previousWinner, gameId, round});
  });

  socket.on(
    "sendMove",
    ({
      id,
      player,
      chatId,
      receivers,
      move_data,
      correct,
      move_type,
      round,
      createdAt,
    }) => {
      console.log("sendMove", move_data);
      console.log(receivers);
      const gotUses = getUsers(receivers);
      console.log(gotUses.map((user) => user.socketId));
      io.to(gotUses.map((user) => user.socketId)).emit("getMove", {
        id,
        player,
        round,
        chatId,
        move_data,
        move_type,
        correct,
        createdAt,
      });
    }
  );

  socket.on('updateWord', ({player, receivers, round_data, roundId, gameId}) => {
    const gotUses = getUsers(receivers);
    io.to(gotUses.map(user => user.socketId)).emit('getUpdatedWord', {
      player,
      round_data,
      roundId,
      gameId
    })
  })

  socket.on('newChat', ({receivers, chat}) => {
    const gotUses = getUsers(receivers);
    io.to(gotUses.map(user => user.socketId)).emit('getNewChat', {
      chat
    })
  })

  socket.on("disconnect", () => {
    console.log("User disconnected");
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users);
  });
});
