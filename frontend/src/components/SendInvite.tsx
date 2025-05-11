import Modal from "./ui/Modal";
import useToggleModal from "../hooks/useToggleModal";
import type { User } from "../types/user";
import { useState } from "react";
import { useSearchParams } from "react-router";
import socket from "../ws/socket";

type SendInviteProps = {
  users: User[];
};

const SendInvite: React.FC<SendInviteProps> = ({ users }) => {
  const [searchParams] = useSearchParams();
  const { isModalOpen, toggleModal } = useToggleModal();
  const [selectedUser, setSelectedUser] = useState("");
  const userId = searchParams.get("user");

  const handleSendInvite = () => {
    socket.emit("walk:invite", { toUserId: selectedUser, fromUserId: userId });
    toggleModal();
  };

  const usersToInvite = users.filter((user) => user.id !== userId);

  return (
    <>
      <button
        onClick={toggleModal}
        className="px-4 py-2 text-xl bg-green-700 text-white border border-gray-700 rounded-md hover:bg-green-900 transition-colors"
      >
        Invite to walk
      </button>

      <Modal isOpen={isModalOpen} close={toggleModal} title="Invite to walk">
        <div className="space-y-4">
          {usersToInvite.length === 0 ? (
            <p className="text-gray-300">No users to invite</p>
          ) : (
            <>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236B7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
              >
                <option value="" disabled>
                  Select user{" "}
                </option>
                {usersToInvite.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.id}
                  </option>
                ))}
              </select>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={toggleModal}
                  className="px-4 py-2 text-sm bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvite}
                  disabled={!selectedUser}
                  className="px-4 py-2 text-sm bg-green-700 text-white rounded-md hover:bg-green-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Invite
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default SendInvite;
