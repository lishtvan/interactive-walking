import { io } from "./server.ts";
import { seedUsers } from "./seed.ts";
import { onJoinExplore, onUpdateLocationExplore } from "./handlers/explore.ts";
import {
  onInviteToWalk,
  onWalkExit,
  onWalkJoin,
  onWalkUpdateLocation,
} from "./handlers/walk.ts";
import { onDisconnect } from "./handlers/disconnect.ts";
import { Socket } from "socket.io";

seedUsers().catch(console.error);

const handlers = {
  "explore:join": onJoinExplore,
  "explore:update-location": onUpdateLocationExplore,
  "walk:invite": onInviteToWalk,
  "walk:join": onWalkJoin,
  "walk:update-location": onWalkUpdateLocation,
  "walk:exit": onWalkExit,
  disconnect: onDisconnect,
};

const registerHandlers = (socket: Socket) => {
  Object.entries(handlers).forEach(([event, handler]) => {
    socket.on(event, (data) => handler(socket, data));
  });
};

io.on("connection", (socket) => {
  registerHandlers(socket);
});
