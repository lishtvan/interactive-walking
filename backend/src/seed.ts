import { pubClient } from "./pubSub.ts";

export const seedUsers = async () => {
  const users = [
    {
      id: "userA",
      color: "red",
      isOnline: false,
      location: { lat: 0.5, lng: 0.5 },
      currentScreen: null,
    },
    {
      id: "userB",
      color: "yellow",
      isOnline: false,
      location: { lat: 0.4, lng: 0.4 },
      currentScreen: null,
    },
    {
      id: "userC",
      color: "blue",
      isOnline: false,
      location: { lat: 0.6, lng: 0.6 },
      currentScreen: null,
    },
  ];

  await Promise.all(
    users.map((user) => pubClient.hset("users", user.id, JSON.stringify(user)))
  );
}
