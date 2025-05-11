import { USER_KEY } from "../pubSub.ts";

import { pubClient } from "../pubSub.ts";
import type { GetOnlineUsersByScreen, UpdateUser } from "../types.ts";

export const updateUser: UpdateUser = async (userId, data) => {
  const existingUser = await pubClient.hget(USER_KEY, userId);
  if (!existingUser) return { error: "User not found", user: null };

  const updatedUser = { ...JSON.parse(existingUser), ...data };
  await pubClient.hset(USER_KEY, userId, JSON.stringify(updatedUser));
  return { error: null, user: updatedUser };
};

export const getUser = async (userId: string) => {
  const user = await pubClient.hget(USER_KEY, userId);
  return user ? JSON.parse(user) : null;
};

export const getOnlineUsersByScreen: GetOnlineUsersByScreen = async (
  screen
) => {
  const users = await pubClient.hgetall(USER_KEY);
  return Object.values(users)
    .map((u) => JSON.parse(u))
    .filter((user) => user.isOnline && user.currentScreen === screen);
};
