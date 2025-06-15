export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  tickets: number;
  prestigeTickets: number;
  avatarUrl?: string;
}

export interface DailyLoginStatus {
  currentStreak: number;
  lastClaimDate: string;
  claimedToday: boolean;
  daysUntilPrestigeTicket: number;
}

export interface ReferralUser {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  joinDate: string;
  status: 'active' | 'pending';
  pointsGenerated: number;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  pendingReferrals: number;
  pointsEarned: number;
}