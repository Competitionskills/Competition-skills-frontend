export interface User {
    email: string;
    tickets: number;
    prestige: number;
    diamonds: number;
    points: number;
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
    imageUrl?: string;  // ✅ Added optional image property
    endsAt?: string;    // ✅ Added optional date property
  }