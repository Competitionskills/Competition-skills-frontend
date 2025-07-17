export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  points: number;
  username?: string;
  tickets?: number;
  prestigeTickets?: number;
}

export interface DailyLoginStatus {
  currentStreak: number;
  lastClaimDate: string;
  claimedToday: boolean;
  daysUntilPrestigeTicket: number;
}

export interface Competition {
  id: string;
  title: string;
  description: string;
  prize: number;
  ticketsSold: number;
  totalTickets: number;
  ticketPrice: number;
  prestigeOnly: boolean;
  imageUrl?: string;
  endsAt?: string;
}