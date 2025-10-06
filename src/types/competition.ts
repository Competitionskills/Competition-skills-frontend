export type CompetitionStatus = "open" | "closed";

export interface Competition {
  _id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  images?: string[];
  startsAt?: string;
  endsAt: string;
  entryCost: number; // required by modal and cards
  status?: CompetitionStatus;
  participants?: { ticketId: string; userId: string }[];
  prizePool?: string | number; // optional convenience
  image?: string;              // legacy fallback
}
