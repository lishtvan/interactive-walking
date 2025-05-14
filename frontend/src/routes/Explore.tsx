import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import socket from "../ws/socket";
import type { User } from "../types/user";
import OnlineUsers from "../components/OnlineUsers";
import Map from "../components/Map";
import useJoinExplore from "../hooks/useJoinExplore";
import SendInvite from "../components/SendInvite";
import ReceiveInviteModal from "../components/ReceiveInviteModal";
import WithErrorHandling from "../components/hoc/SocketErrorHandling";
import useFakeWalk from "../hooks/useFakeWalk";

type ExploreProps = {
  userId: string;
};

const Explore: React.FC<ExploreProps> = ({ userId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const eventData = useMemo(
    () => ({ userId, event: "explore:update-location" }),
    [userId]
  );
  useFakeWalk(eventData, setUsers);
  const { isLoading } = useJoinExplore(userId, setUsers);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("walk:join", ({ walkId }) => {
      navigate(`/walk/${walkId}?user=${userId}`);
    });

    return () => {
      socket.off("walk:join");
    };
  }, [navigate, userId]);

  if (isLoading) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-6xl flex gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 px-4">
            <h1 className="text-2xl font-semibold text-white mt-2">Explore</h1>
            <SendInvite users={users} />
          </div>
          <Map users={users} />
        </div>
        <OnlineUsers users={users} />
      </div>
      <ReceiveInviteModal />
    </div>
  );
};

const ExplorePage = WithErrorHandling(Explore);
export default ExplorePage;
