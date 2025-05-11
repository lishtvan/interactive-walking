import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import type { User } from "../types/user";
import OnlineUsers from "../components/OnlineUsers";
import Map from "../components/Map";
import WithErrorHandling from "../components/hoc/SocketErrorHandling";
import useFakeWalk from "../hooks/useFakeWalk";
import socket from "../ws/socket";

type WalkProps = {
  userId: string;
};

const Walk: React.FC<WalkProps> = ({ userId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const { walkId } = useParams();
  const navigate = useNavigate();

  const updateUsers = useCallback((newUsers: User[]) => setUsers(newUsers), []);
  const eventData = useMemo(
    () => ({ userId, walkId, event: "walk:update-location" }),
    [userId, walkId]
  );

  useFakeWalk(eventData, updateUsers);

  useEffect(() => {
    socket.on("walk:exit", () => {
      navigate(`/explore?user=${userId}`);
    });

    return () => {
      socket.off("walk:exit");
    };
  }, [navigate, userId, walkId]);

  const leaveWalk = () => {
    socket.emit("walk:exit", { walkId });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
      <div className="w-full max-w-6xl flex gap-6">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4 px-4">
            <h1 className="text-2xl font-semibold text-white mt-2">Walk</h1>
            <button
              onClick={leaveWalk}
              className="px-4 py-2 text-xl bg-green-700 text-white border border-gray-700 rounded-md hover:bg-green-900 transition-colors"
            >
              Leave walk
            </button>
          </div>
          <Map users={users} />
        </div>
        <OnlineUsers users={users} />
      </div>
    </div>
  );
};

const WalkPage = WithErrorHandling(Walk);
export default WalkPage;
