import { Socket } from "socket.io";
import { publish } from "../pubSub.ts";
import { updateUser } from "../repo/user.ts";

import { getOnlineUsersByScreen } from "../repo/user.ts";

export const onDisconnect = async (socket: Socket) => {
  const userId = socket.data.userId;
  if (!userId) return;

  const { user, error } = await updateUser(userId, { isOnline: false });

  if (error) {
    socket.emit("error", { message: error });
    return;
  }

  if (user!.currentScreen === "explore") {
    const exploreUsers = await getOnlineUsersByScreen("explore");
    publish({ event: "explore:join", users: exploreUsers });
  }
};
