import React from "react";
import { getCompetitionPhase } from "../../utils/competition";

export type MyCompetitionItem = {
  competitionId: string;
  competitionName: string;
  ticketsUsed: number;
  startsAt?: string | number | Date;
  endsAt: string | number | Date;
};

type Props = { items: MyCompetitionItem[] };

type Phase = "open" | "upcoming" | "ended";
const phaseBadge = (p: Phase) =>
  p === "open"
    ? "bg-green-100 text-green-700"
    : p === "upcoming"
    ? "bg-blue-100 text-blue-700"
    : "bg-gray-200 text-gray-700";

const MyCompetitions: React.FC<Props> = ({ items }) => {
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
              <th className="px-2 py-3">Action</th> {/* NEW */}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                  You haven’t entered any competitions yet.
                </td>
              </tr>
            ) : (
              items.map((it) => {
                const { phase, timeLabel } = getCompetitionPhase({
                  _id: it.competitionId,
                  title: it.competitionName,
                  startsAt: it.startsAt,
                  endsAt: it.endsAt,
                });

                return (
                  <tr
                    key={it.competitionId}
                    className="border-b border-indigo-100 transition-colors hover:bg-indigo-50/50"
                  >
                    <td className="py-4 text-sm font-semibold text-indigo-900">
                      {it.competitionName}
                    </td>
                    <td className="py-4">
                      <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                        {it.ticketsUsed}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${phaseBadge(phase)}`}>
                        {phase}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-indigo-500">{timeLabel}</td>
                    <td className="py-4">
                      {phase === "ended" ? (
                        <a
                          href={`/results/${it.competitionId}`}
                          className="inline-block rounded-lg border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                        >
                          Check result
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MyCompetitions;
