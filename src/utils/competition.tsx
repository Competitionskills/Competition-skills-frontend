export type Competition = {
  _id: string;
  title: string;
  startsAt?: string | number | Date;
  endsAt: string | number | Date;
};

const toDate = (v: string | number | Date) => (v instanceof Date ? v : new Date(v));

export function formatDuration(ms: number) {
  if (ms <= 0) return "Ended";
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m`;
  return `${s % 60}s`;
}

export function getCompetitionPhase(c: Competition, now = new Date()) {
  const end = toDate(c.endsAt);
  const start = c.startsAt ? toDate(c.startsAt) : undefined;

  const n = now.getTime();
  const hasStarted = !start || start.getTime() <= n;
  const hasEnded = end.getTime() <= n;

  const phase: "upcoming" | "open" | "ended" =
    hasEnded ? "ended" : hasStarted ? "open" : "upcoming";

  const msLeft = Math.max(0, end.getTime() - n);
  const timeLabel = hasEnded ? "Ended" : `Ends in ${formatDuration(msLeft)}`;

  return { phase, isOpen: phase === "open", timeLabel };
}
