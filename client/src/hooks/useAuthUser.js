import { useQuery } from "@tanstack/react-query";
import { getAuthUser, getStreamToken } from "../lib/api";
import { useEffect, useRef, useState, useMemo } from "react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

// Create a single instance of the client (singleton pattern)
const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

const useAuthUser = () => {
  const [isOnline, setIsOnline] = useState(false);
  const isConnectedRef = useRef(false);
  const isMountedRef = useRef(true);

  const authQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false,
  });

  useEffect(() => {
    // Set mounted flag to false on cleanup
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const connectStream = async () => {
      const user = authQuery.data?.user;

      // Ensure only one connection attempt
      if (!user || isConnectedRef.current || client.userID) return;

      try {
        const tokenRes = await getStreamToken();

        await client.connectUser(
          {
            id: user._id,
            name: user.fullName,
            image: user.profilePicture,
          },
          tokenRes.token
        );

        isConnectedRef.current = true;

        const { users } = await client.queryUsers({ id: { $eq: user._id } });

        if (isMountedRef.current) {
          setIsOnline(users?.[0]?.online || false);
        }
      } catch (error) {
        console.error("Stream connect error:", error);
        if (isMountedRef.current) {
          setIsOnline(false);
          toast.error("Failed to connect to chat. Try again later.");
        }
      }
    };

    connectStream();
  }, [authQuery.data?.user]);

  const memoizedUser = useMemo(() => {
    const user = authQuery.data?.user;
    if (!user) return null;
    return { ...user, isOnline };
  }, [authQuery.data?.user, isOnline]);

  return {
    isLoading: authQuery.isLoading,
    authUser: memoizedUser,
  };
};

export default useAuthUser;
