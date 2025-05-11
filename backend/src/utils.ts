import type { User } from "./types.ts";

export const isUserInWalk = (user: User) => {
  return user.currentScreen !== null && user.currentScreen !== "explore";
};
