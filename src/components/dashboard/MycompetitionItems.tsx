import React from "react";

export type CompetitionStatus = "open" | "closed" | "won" | "lost" | "pending";

export type MyCompetitionItem = {
  competitionName: string;
  ticketsUsed: number;
  status: "open" | "closed";
  time: string;
};

type Props = { items: MyCompetitionItem[] };

interface MyCompetitionsProps {
  items: MyCompetitionItem[];
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



const MyCompetitions: React.FC<MyCompetitionsProps> = ({ items }) => {
  return (
    <section className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-indigo-900">My Competitions</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-indigo-50/60 text-left text-sm text-indigo-900">
            <tr>
              <th className="px-2 py-3">Competition</th>
              <th className="px-2 py-3">Tickets Used</th>
              <th className="px-2 py-3">Status</th>
              <th className="px-2 py-3">Time</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                  You haven’t entered any competitions yet.
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={`${it.competitionName}-${it.time}`} className="border-b border-indigo-100 transition-colors hover:bg-indigo-50/50">
                  <td className="py-4 text-sm font-semibold text-indigo-900">{it.competitionName}</td>
                  <td className="py-4">
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      {it.ticketsUsed}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusBadge(it.status)}`}>
                      {it.status}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-indigo-500">{it.time}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MyCompetitions;
