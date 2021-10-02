const { io } = require("./http");

const users = Array(0);
const messages = Array(0);

io.on("connection", (socket) => {
  socket.on("select_room", (data, callback) => {
    socket.join(data.room);

    const userInRoom = users.find(
      (user) => user.username === data.username && user.room === data.room
    );

    if (userInRoom) {
      userInRoom.socketid = socket.id;
    } else {
      users.push({
        username: data.username,
        room: data.room,
        colorUsername: data.colorUsername,
        socketid: socket.id,
      });
    }

    const messagesRoom = getMessagesRoom(data.room);
    callback(messagesRoom);
  });

  socket.on("message", (data) => {
    const message = {
      username: data.username,
      room: data.room,
      colorUsername: data.colorUsername,
      text: data.message,
      hours: getDate(),
    };

    messages.push(message);

    io.to(data.room).emit("message", message);
  });
});

function getMessagesRoom(room) {
  const messagesRoom = messages.filter((message) => message.room === room);

  return messagesRoom;
}

function getDate() {
  const dateBrazil = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });
  const hours = dateBrazil[11] + dateBrazil[12];
  const minutes = dateBrazil[14] + dateBrazil[15];
  const hoursAndMinutes = `${hours}:${minutes}`;

  return hoursAndMinutes;
}
