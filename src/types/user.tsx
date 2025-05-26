export interface UserProfile {
    id: string;
    username: string;
    email: string;
    points: number;
    tickets: number;
    prestigeTickets: number;
    referrals: number;
    codesSubmitted: number;
  }
  
  export interface DailyLoginStatus {
    currentStreak: number;
    lastClaimDate: string;
    claimedToday: boolean;
    daysUntilPrestigeTicket: number;
  }
  
  export interface DailyRewardResponse {
    success: boolean;
    message: string;
    reward: {
      points: number;
      prestigeTickets: number;
    };
    newStatus: DailyLoginStatus;
  }