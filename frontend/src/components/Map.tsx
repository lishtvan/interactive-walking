import type { User } from "../types/user";

type MapProps = {
  users: User[];
};

const Map: React.FC<MapProps> = ({ users }) => {
  return (
    <div className="w-full bg-gray-800 rounded-lg shadow-lg relative">
      <div className="h-96">
        {users.map((user) => (
          <div
            key={user.id}
            className="absolute w-8 h-8 rounded-full transition-all duration-700 ease-linear"
            style={{
              left: `${user.location.lat * 100}%`,
              top: `${user.location.lng * 100}%`,
              transform: "translate(-50%, -50%)",
              backgroundColor: user.color,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Map;
