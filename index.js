import express  from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("User connected");
  socket.on("client:join", (id) => {
    if(["1", "2"].includes(id)) {
      socket.join("room1");
    }
  });

  socket.on("client:message", (data) => {
    socket.to("room1").emit("server:message", data);
  });

  socket.on("client:typing", (isTyping) => {
    socket.to("room1").emit("server:typing", isTyping);
  });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server is running on port 5000");
});