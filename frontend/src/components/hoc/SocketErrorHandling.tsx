import { useSearchParams } from "react-router";
import { useState } from "react";
import socket from "../../ws/socket";
import { useEffect } from "react";

const WithErrorHandling = (
  Component: React.ComponentType<{ userId: string }>
) => {
  const Page = () => {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("user");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      socket.on("error", (error: { message: string }) => {
        setError(error.message);
      });

      return () => {
        socket.off("error");
      };
    }, []);

    if (error || !userId) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900">
          <div className="text-2xl font-bold">{error || "User not found"}</div>
        </div>
      );
    }

    return <Component userId={userId} />;
  };

  return Page;
};

export default WithErrorHandling;
