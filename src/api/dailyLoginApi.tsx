import api from "../helpers/axios";

export interface DailyLoginResponse {
  message: string;
  streak: number;
  totalPoints: number;
  totalPrestigeTickets: number;
}

export const claimDailyReward = async (): Promise<DailyLoginResponse> => {
  const response = await api.post("/daily-login");
  return response.data;
};

export const getDailyLoginStatus = async () => {
  const response = await api.get("/daily-login/status");
  return response.data;
};