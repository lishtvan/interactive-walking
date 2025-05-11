import { useState } from "react";
import { useNavigate } from "react-router";

const App = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(`/explore?user=${username}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className={`w-full px-4 py-3 bg-gray-800 border-2 rounded-lg outline-none transition-all duration-200 text-white placeholder-gray-500 border-gray-700 hover:border-gray-600`}
            />
            <div
              className={`absolute inset-0 rounded-lg transition-opacity duration-200 pointer-events-none bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0`}
            />
          </div>

          <button
            onClick={handleStart}
            disabled={!username.trim()}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200
              ${
                username.trim()
                  ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
          >
            Join Explore
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
