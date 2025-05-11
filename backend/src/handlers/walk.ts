import { getOnlineUsersByScreen, getUser, updateUser } from "../repo/user.ts";

import { Socket } from "socket.io";
import { isUserInWalk } from "../utils.ts";
import { publish } from "../pubSub.ts";
import type { Location } from "../types.ts";

export const onInviteToWalk = async (
  socket: Socket,
  data: { fromUserId: string; toUserId: string }
) => {
  const { fromUserId, toUserId } = data;

  const walkId = crypto.randomUUID();

  const user = await getUser(toUserId);
  if (!user) {
    socket.emit("error", { message: "User not found" });
    return;
  }

  if (isUserInWalk(user)) {
    socket.emit("error", { message: "User is already in a walk" });
    return;
  }

  publish({ event: "walk:invite", fromUserId, toUserId, walkId });
};

export const onWalkJoin = async (
  socket: Socket,
  data: { walkId: string; userIds: string[] }
) => {
  const { walkId, userIds } = data;

  socket.leave("explore");
  socket.join(walkId);

  await Promise.all(
    userIds.map((userId: string) =>
      updateUser(userId, { isOnline: true, currentScreen: walkId })
    )
  );

  const exploreUsers = await getOnlineUsersByScreen("explore");

  publish({ event: "walk:join", userIds, walkId });
  publish({ event: "explore:join", users: exploreUsers });
};

export const onWalkUpdateLocation = async (
  socket: Socket,
  data: { userId: string; walkId: string; newLocation: Location }
) => {
  const { userId, walkId, newLocation } = data;

  const result = await updateUser(userId, {
    location: newLocation,
    isOnline: true,
  });
  if (result.error) {
    socket.emit("error", { message: result.error });
    return;
  }
  socket.join(walkId);

  const walkUsers = await getOnlineUsersByScreen(walkId);

  publish({ event: "walk:update-location", users: walkUsers, walkId });
};

export const onWalkExit = async (socket: Socket, data: { walkId: string }) => {
  const { walkId } = data;

  const walkUsers = await getOnlineUsersByScreen(walkId);

  await Promise.all(
    walkUsers.map((user) => updateUser(user.id, { currentScreen: null }))
  );

  publish({
    event: "walk:exit",
    walkId,
    userIds: walkUsers.map((user) => user.id),
  });
};
