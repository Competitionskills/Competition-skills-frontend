// src/pages/Competitions.tsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { Footer } from "../components/footer";
import BackgroundImage from "../images/background-img.jpg";
import ParticipationModal from "../components/participationModal";

// CRA env (no import.meta)
const API_BASE =
  process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk";

type CompetitionStatus = "open" | "closed";

interface Competition {
  _id: string;
  title: string;
  description?: string;
  endsAt: string;
  entryCost: number;
  maxTicketsPerUser: number; // 0 = unlimited
  status: CompetitionStatus;
  participants?: Array<{ ticketId: string; userId: string }>;

  // images (any one or more may be present)
  bannerUrl?: string;
  images?: string[];
  coverUrl?: string; // virtual from backend (optional)
}

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || data?.error || `HTTP ${res.status}`);
  return data as T;
}

/* ---------- helpers ---------- */
function timeLeft(iso?: string) {
  if (!iso) return "—";
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return "ended";
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}
const isEnded = (c: Competition) =>
  new Date(c.endsAt).getTime() <= Date.now() || c.status !== "open";

const coverFor = (c: Competition) =>
  (c.coverUrl || c.bannerUrl || c.images?.[0] || "").trim();

const timeLabel = (c: Competition) =>
  isEnded(c) ? "Ended" : `Ends in ${timeLeft(c.endsAt)}`;

/* ---------- page ---------- */
const CompetitionsPage: React.FC = () => {
  const [filter, setFilter] = useState<"open" | "closed" | "all">("all");
  const [list, setList] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // description expand/collapse per card
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleDesc = (id: string) =>
    setExpanded((s) => ({ ...s, [id]: !s[id] }));

  // shared participation modal
  const [modal, setModal] = useState<{ open: boolean; comp: Competition | null }>({
    open: false,
    comp: null,
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async (f = filter) => {
    setLoading(true);
    setError(null);
    try {
      const q = f === "all" ? "" : `?status=${f}`;
      const data = await http<Competition[]>(`/api/competitions${q}`);
      setList(data);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const askParticipate = (c: Competition) => {
    if (isEnded(c)) return;
    setModal({ open: true, comp: c });
  };

  const confirmParticipate = async (c: Competition) => {
    try {
      setSubmitting(true);
      await http(`/api/competitions/${c._id}/participate`, {
        method: "POST",
        body: JSON.stringify({ ticketCount: 1 }),
      });
      setModal({ open: false, comp: null });
      await fetchAll(filter);
    } catch (e) {
      // rethrow so modal shows the error
      throw e;
    } finally {
      setSubmitting(false);
    }
  };

  const cards = useMemo(
    () =>
      list.map((c) => {
        const ended = isEnded(c);
        const badgeClass = ended
          ? "rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700"
          : "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700";

        return (
          <div key={c._id} className="rounded-2xl border bg-white p-4 shadow-sm">
            {/* cover image */}
            <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl">
              {coverFor(c) ? (
                <img
                  src={coverFor(c)}
                  alt={c.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-indigo-50 to-purple-50" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
              <div className="absolute top-2 right-2">
                <span className={badgeClass}>{ended ? "ended" : "open"}</span>
              </div>
              <div className="absolute bottom-2 left-3 text-white">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="text-xs opacity-90">{timeLabel(c)}</p>
              </div>
            </div>

            {/* description with Read more / Show less */}
            <div className="mb-3">
              <p
                className={`text-sm text-gray-600 ${
                  expanded[c._id] ? "" : "line-clamp-2"
                }`}
              >
                {c.description || "No description."}
              </p>
              {c.description && c.description.length > 120 && (
                <button
                  type="button"
                  onClick={() => toggleDesc(c._id)}
                  className="mt-1 text-xs font-semibold text-indigo-700 hover:underline"
                >
                  {expanded[c._id] ? "Show less" : "Read more"}
                </button>
              )}
            </div>

            <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="text-gray-900">Entry cost</div>
                <div className="font-semibold text-gray-700">
                  {c.entryCost} prestige ticket(s)
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="text-gray-900">Max per user</div>
                <div className="font-semibold text-gray-700">
                  {c.maxTicketsPerUser || "Unlimited"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => askParticipate(c)}
                disabled={ended}
                className="text-xs font-medium disabled:text-gray-400 text-indigo-700 hover:underline"
                title={ended ? "Competition ended" : "Join this competition"}
              >
                Participants: {c.participants?.length ?? 0}
              </button>

              <button
                disabled={ended}
                onClick={() => askParticipate(c)}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {ended ? "Ended" : "Participate"}
              </button>
            </div>
          </div>
        );
      }),
    [list, expanded]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div
        className="relative flex-grow bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-sm" />

        <div className="relative mx-auto w-full max-w-6xl p-4 md:p-8">
          {/* Page title + filter pills */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Competitions</h1>
              <p className="text-sm text-gray-600">Join any open competition.</p>
            </div>

            <div className="flex items-center gap-2">
              {(["open", "closed", "all"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    filter === f
                      ? "bg-indigo-600 text-white"
                      : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
                  }`}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          {loading && (
            <div className="rounded-xl border bg-white/70 p-6">Loading…</div>
          )}
          {error && (
            <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {cards}
              {cards.length === 0 && (
                <div className="col-span-full rounded-xl border bg-white/70 p-8 text-center text-sm text-gray-600">
                  No competitions found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Shared participation modal */}
      <ParticipationModal
        open={modal.open}
        competition={modal.comp as any}
        onClose={() => setModal({ open: false, comp: null })}
        onConfirm={(c) => confirmParticipate(c as any)}
        isSubmitting={submitting}
      />
    </div>
  );
};

export default CompetitionsPage;
