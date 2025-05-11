import { Socket } from "socket.io";
import { updateUser } from "../repo/user.ts";
import { getOnlineUsersByScreen } from "../repo/user.ts";
import { getUser } from "../repo/user.ts";
import { publish } from "../pubSub.ts";
import { isUserInWalk } from "../utils.ts";
import type { Location } from "../types.ts";

export const onJoinExplore = async (
  socket: Socket,
  data: { userId: string }
) => {
  const userId = data.userId;
  socket.data.userId = userId;
  const user = await getUser(userId);
  if (!user) {
    socket.emit("error", { message: "User not found" });
    return;
  }

  if (isUserInWalk(user)) {
    socket.emit("error", { message: "User is already in a walk" });
    return;
  }

  socket.join("explore");

  await updateUser(userId, { isOnline: true, currentScreen: "explore" });
  const exploreUsers = await getOnlineUsersByScreen("explore");

  publish({ event: "explore:join", users: exploreUsers });
};

export const onUpdateLocationExplore = async (
  socket: Socket,
  data: { userId: string; newLocation: Location }
) => {
  const result = await updateUser(data.userId, {
    location: data.newLocation,
  });
  if (result.error) {
    socket.emit("error", { message: result.error });
    return;
  }

  const exploreUsers = await getOnlineUsersByScreen("explore");

  publish({ event: "explore:update-location", users: exploreUsers });
};
