import Modal from "./ui/Modal";
import { useEffect, useCallback, useState } from "react";
import socket from "../ws/socket";
import { useSearchParams } from "react-router";

type Invite = {
  fromUserId: string;
  walkId: string;
};

const ReceiveInviteModal = () => {
  const [invite, setInvite] = useState<Invite | null>(null);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");

  useEffect(() => {
    socket.on("walk:invite", ({ fromUserId, walkId }) => {
      setInvite({ fromUserId, walkId });
    });

    return () => {
      socket.off("walk:invite");
    };
  }, []);

  const rejectInvite = useCallback(() => {
    setInvite(null);
  }, []);

  const acceptInvite = () => {
    if (!invite) return;

    socket.emit("walk:join", {
      walkId: invite.walkId,
      userIds: [invite.fromUserId, userId],
    });

    setInvite(null);
  };

  return (
    <Modal isOpen={!!invite} close={rejectInvite} title="Walk Invite">
      <div className="flex flex-col gap-4">
        <p>{invite?.fromUserId} wants to walk with you</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={rejectInvite}
            className="px-4 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={acceptInvite}
            className="px-4 py-2 text-sm bg-green-700 text-white rounded-md hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept Invite
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiveInviteModal;
