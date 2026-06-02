export function iniciarPairProgrammingSocket(io) {
  io.on("connection", (socket) => {
    console.log("[PAIR PROGRAMMING] Cliente conectado");

    socket.on("disconnect", () => {
      console.log("[PAIR PROGRAMMING] Cliente desconectado");
    });
  });
}
