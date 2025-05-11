import { useEffect, useState } from "react";
import type { User } from "../types/user";
import socket from "../ws/socket";

const useJoinExplore = (
  userId: string | null,
  setUsers: (users: User[]) => void
) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    socket.emit("explore:join", { userId });

    socket.on("explore:join", (onlineUsers: User[]) => {
      setUsers(onlineUsers);
      setIsLoading(false);
    });

    return () => {
      socket.off("explore:join");
    };
  }, [userId, setUsers]);

  return { isLoading };
};

export default useJoinExplore;
