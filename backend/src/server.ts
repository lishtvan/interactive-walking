import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173" },
});

httpServer.listen(3000, () => {
  console.log("Server is running on localhost:3000");
});
