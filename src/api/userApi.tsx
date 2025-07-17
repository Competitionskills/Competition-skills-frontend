import api from "../helpers/axios";

export const fetchUserProfile = async () => {
  const response = await api.get("/users/user");
  return response.data;
};

export const buyPrestigeTicket = async () => {
  const response = await api.post("/tickets/buy-prestige-ticket");
  return response.data;
};

export const claimDailyReward = async () => {
  const response = await api.post("/users/claim-daily-reward");
  return response.data;
};

export const getDailyLoginStatus = async () => {
  const response = await api.get("/users/daily-login-status");
  return response.data;
};