// MyCompetitionRow.tsx
import React from "react";

export type CompetitionStatus = "open" | "closed" | "won" | "lost" | "pending";

interface MyCompetitionRowProps {
  competitionName: string;
  ticketsUsed: number;
  status: CompetitionStatus;
  time: string; // e.g., "Aug 24, 10:30 PM" or "Ends in 2h"
}

const statusBadge = (s: CompetitionStatus) => {
  const map: Record<CompetitionStatus, string> = {
    open: "bg-green-100 text-green-700",
    closed: "bg-gray-200 text-gray-700",
    won: "bg-emerald-100 text-emerald-700",
    lost: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };
  return map[s] || "bg-indigo-100 text-indigo-700";
};

export const MyCompetitionRow: React.FC<MyCompetitionRowProps> = ({
  competitionName,
  ticketsUsed,
  status,
  time,
}) => (
  <tr className="border-b border-indigo-100 transition-colors hover:bg-indigo-50/50">
    <td className="py-4 text-sm font-semibold text-indigo-900">{competitionName}</td>
    <td className="py-4">
      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
        {ticketsUsed}
      </span>
    </td>
    <td className="py-4">
      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge(status)}`}>
        {status}
      </span>
    </td>
    <td className="py-4 text-sm text-indigo-500">{time}</td>
  </tr>
);
