import type { User } from "../types/user";

type OnlineUsersProps = {
  users: User[];
};

const OnlineUsers: React.FC<OnlineUsersProps> = ({ users }) => {
  return (
    <div className="w-64 bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-lg font-semibold text-white mb-4">Online Users</h2>
      <div className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <span className="text-gray-200">{user.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnlineUsers;
