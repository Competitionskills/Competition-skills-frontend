import api from "../helpers/axios";

export interface DailyLoginResponse {
  success?: boolean;
  message: string;
  streak: number;
  totalPoints: number;
  totalPrestigeTickets: number;
  reward: {
    points: number;
    prestigeTickets?: number;
  };
  nextReward?: {
    points: number;
    prestigeTickets?: number;
  };
}

export const claimDailyReward = async (): Promise<DailyLoginResponse> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("❌ No auth token found in localStorage");
    throw new Error("No auth token found");
  }

  console.log("🚀 [claimDailyReward] Preparing to send request...");
  console.log("🪪 [Header Token]:", token);

  try {
    const response = await api.post<DailyLoginResponse>(
      "/rewards/daily-login",
      {}, // empty body
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ [claimDailyReward] Raw response object:", response);
    console.log("✅ [claimDailyReward] Response status:", response.status);
    console.log("✅ [claimDailyReward] Response data:", response.data);

    // Extra: Verify that streak is included
    if (typeof response.data.streak === "number") {
      console.log("🔥 [claimDailyReward] STREAK received:", response.data.streak);
    } else {
      console.warn("⚠️ [claimDailyReward] Streak field is missing in response!");
    }

    return response.data;
  } catch (error: any) {
    console.error("❌ [claimDailyReward] Error occurred:", error);

    // Check Axios error details
    if (error.response) {
      console.error("❌ Response status:", error.response.status);
      console.error("❌ Response data:", error.response.data);
    }
    if (error.request) {
      console.error("❌ No response received. Request was:", error.request);
    }
    console.error("❌ Request config:", error.config);

    throw new Error(error.response?.data?.error || "Failed to claim daily reward");
  }
};
