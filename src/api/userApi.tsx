import api from "../helpers/axios";
import { DailyLoginStatus } from "../types/user";

export const fetchUserProfile = async () => {
  const response = await api.get("/users/user");
  return response.data;
};

export const buyPrestigeTicket = async () => {
  const response = await api.post("/tickets/buy-prestige-ticket");
  return response.data;
};

export const getDailyLoginStatus = async (): Promise<DailyLoginStatus> => {
  const response = await api.get("/users/daily-login-status");
  return response.data;
};