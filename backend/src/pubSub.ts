import { Redis } from "ioredis";
import { io } from "./server.ts";

export const pubClient = new Redis({ host: "localhost", port: 6379 });
export const subClient = pubClient.duplicate();
export const USER_KEY = "users";

pubClient.on("error", (err) => console.error("PubClient error:", err));
subClient.on("error", (err) => console.error("SubClient error:", err));

export const publish = (data: any) => {
  pubClient.publish("channel:broadcast", JSON.stringify(data));
};

const getSocketsByUserIds = (userIds: string[]) => {
  const sockets = io.sockets.sockets;
  return Array.from(sockets.values()).filter((socket) =>
    userIds.includes(socket.data.userId)
  );
};

const broadcast: Record<string, (data: any) => void> = {
  "explore:join": ({ users }) => {
    io.to("explore").emit("explore:join", users);
  },
  "walk:join": ({ userIds, walkId }) => {
    const userSockets = getSocketsByUserIds(userIds);
    userSockets.forEach((socket) => socket.emit("walk:join", { walkId }));
  },
  "explore:update-location": ({ users }) => {
    io.to("explore").emit("explore:update-location", users);
  },
  "walk:update-location": ({ users, walkId }) => {
    io.to(walkId).emit("walk:update-location", users);
  },
  "walk:invite": ({ fromUserId, toUserId, walkId }) => {
    const [receiverSocket] = getSocketsByUserIds([toUserId]);
    if (!receiverSocket) return;
    receiverSocket.emit("walk:invite", { fromUserId, toUserId, walkId });
  },
  "walk:exit": ({ walkId, userIds }) => {
    const userSockets = getSocketsByUserIds(userIds);
    userSockets.forEach((socket) => socket.emit("walk:exit", { walkId }));
  },
};

subClient.subscribe("channel:broadcast");
subClient.on("message", (_, message) => {
  const data = JSON.parse(message);
  const emitEvent = broadcast[data.event];
  if (emitEvent) emitEvent(data);
});
