import api from "../helpers/axios";

export interface DailyLoginResponse {
  success: boolean;
  message: string;
  streak: number;
  totalPoints: number;
  totalPrestigeTickets: number;
  reward: {
    points: number;
    prestigeTickets: number;
  };
  nextReward: {
    points: number;
    prestigeTickets?: number;
  };
}

export const claimDailyReward = async (): Promise<DailyLoginResponse> => {
  try {
    const token = localStorage.getItem("token"); // or "authToken"
    if (!token) throw new Error("No auth token found");

    console.log("✅ Sending token in header:", token);

    const response = await api.post<DailyLoginResponse>(
      "/rewards/daily-login",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Daily login response:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("❌ Error claiming daily reward:", error);

    // Log full Axios error config for debugging
    if (error.config) {
      console.error("❌ Request config:", error.config);
    }

    throw new Error(error.response?.data?.error || "Failed to claim daily reward");
  }
};
