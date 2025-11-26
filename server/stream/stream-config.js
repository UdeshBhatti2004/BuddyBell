import { StreamChat } from "stream-chat";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const secretKey = process.env.STREAM_API_SECRET;

const streamClient = StreamChat.getInstance(apiKey, secretKey);

export const upsertUser = async ({ id, name, image }) => {
  try {
    const data = await streamClient.upsertUser({ id, name, image });
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const generateStreamToken = async (id) => {
  try {
    const userId = id.toString(); //ensure that the userId must be string

    return streamClient.createToken(userId);
    
  } catch (error) {
    console.error("Error generating steam token", error);
  }
};
