import { StreamChat } from "stream-chat";

let chatClient = null;

export const getStreamClient = () => {
  if (!chatClient) {
    chatClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
  }
  return chatClient;
};
