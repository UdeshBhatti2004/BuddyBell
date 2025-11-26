import axios from "axios";

// Use same-origin in production; keep localhost for local dev.
const getBaseURL = () => {
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:8080";
  } else {
    return ""; // same origin in production (https://buddybell.onrender.com)
  }
};

export const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true
});

export const getDynamicThemes = async () => {
  try {
    const response = await axiosInstance.get("/api/themes");
    if (response.data?.result) return response.data.result;
    return null;
  } catch (err) {
    console.error("Failed to fetch dynamic themes:", err);
    return null;
  }
};
