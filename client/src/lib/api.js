import { axiosInstance } from "../axios-config/axios";

export const getAuthUser = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};

export const register = async (registerData) => {
  const response = await axiosInstance.post("/auth/register", registerData);
  return response.data;
};

export const completeOnboarding = async(formData) => {
  const response = await axiosInstance.post("/auth/onboarding", formData);
  return response.data;
}

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.get("/auth/logout");
  return response.data;
};

export const getUserFriends = async () => {
  const response = await axiosInstance.get("/user/friends");
  return response.data;
};


export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/user/recommended");
  return response.data;
};

export const getOutGoingFriendReqs = async () => {
  const response = await axiosInstance.get("/user/outgoing-friend-requests");
  return response.data;
};

export const sendFriendRequest = async (userId) => {
  const response = await axiosInstance.post(`/user/friend-request/${userId}`);
  return response.data;
};

export const getFriendRequests = async () => {
  const response = await axiosInstance.get("/user/friend-requests");
  return response.data;
}

export const acceptFriendRequest = async (requestId) => {
  const response = await axiosInstance.post(`/user/friend-request/${requestId}/accept`);
  return response.data;
}

export const getStreamToken = async () => {
  const response = await axiosInstance.get("/chat/token");
  return response.data;
}

export const cancelFriendRequest = async ( recipientId ) => {
   const response = await axiosInstance.delete(`/user/friend-request/${recipientId}/cancel`);
   return response.data;
}

export const removeFriend = async ( id ) => {
   const response = await axiosInstance.delete(`/user/friend/${id}/remove`);
   return response.data;
}




