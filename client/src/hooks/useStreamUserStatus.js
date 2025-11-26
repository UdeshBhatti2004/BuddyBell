// hooks/useStreamUserStatus.js
import { useEffect, useState } from "react";
import { getStreamClient } from "../lib/streamClient";

const useStreamUserStatus = (userId) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const client = getStreamClient();

    const checkPresence = async () => {
      try {
        const { users } = await client.queryUsers({ id: { $eq: userId } }, {}, { presence: true });
        setIsOnline(users?.[0]?.online || false);
      } catch (error) {
        console.error("Presence check failed:", error);
      }
    };

    checkPresence();

    const onPresenceChange = (event) => {
      if (event.user?.id === userId) {
        setIsOnline(event.user.online);
      }
    };

    client.on("user.presence.changed", onPresenceChange);
    return () => client.off("user.presence.changed", onPresenceChange);
  }, [userId]);

  return isOnline;
};

export default useStreamUserStatus;
