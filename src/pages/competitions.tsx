// src/pages/Competitions.tsx
import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/Header";
import { Footer } from "../components/footer";
import BackgroundImage from "../images/background-img.jpg";

// CRA env (no import.meta)
const API_BASE = process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk";

type CompetitionStatus = "open" | "closed";

interface Competition {
  _id: string;
  title: string;
  description?: string;
  endsAt: string;
  entryCost: number;
  maxTicketsPerUser: number;   // 0 = unlimited
  status: CompetitionStatus;
  participants?: Array<{ ticketId: string; userId: string }>;
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

const ParticipateModal: React.FC<{
  open: boolean;
  onClose: () => void;
  competition: Competition | null;
  onSuccess: () => void;
}> = ({ open, onClose, competition, onSuccess }) => {
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    if (open) { setQty(1); setErr(null); setOk(null); }
  }, [open]);

  if (!open || !competition) return null;

  const submit = async () => {
    setBusy(true); setErr(null); setOk(null);
    try {
      await http(`/api/competitions/${competition._id}/participate`, {
        method: "POST",
        body: JSON.stringify({ ticketCount: qty }),
      });
      setOk(`Entered with ${qty} ticket${qty > 1 ? "s" : ""}. Good luck!`);
      onSuccess();
    } catch (e: any) {
      setErr(e.message || "Failed to participate");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Participate in {competition.title}</h2>
          <button onClick={onClose} className="rounded px-2 py-1 text-sm hover:bg-gray-100">✕</button>
        </div>

        {err && <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{err}</div>}
        {ok &&  <div className="mb-3 rounded-lg bg-green-50 p-3 text-sm text-green-700">{ok}</div>}

        <label className="block text-sm font-medium">Entries</label>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, parseInt(e.target.value || "1", 10)))}
          className="mb-3 w-full rounded-lg border p-2"
        />
        <p className="mb-4 text-sm text-gray-600">
          Cost per entry: <b>{competition.entryCost}</b> prestige ticket(s)
        </p>

        <button
          disabled={busy}
          onClick={submit}
          className="w-full rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {busy ? "Submitting…" : "Confirm Entry"}
        </button>
      </div>
    </div>
  );
};

const CompetitionsPage: React.FC = () => {
  const [filter, setFilter] = useState<"open" | "closed" | "all">("all");
  const [list, setList] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Competition | null>(null);

  const fetchAll = async (f = filter) => {
    setLoading(true); setError(null);
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

  useEffect(() => { fetchAll(filter); }, [filter]); // eslint-disable-line

  const cards = useMemo(
    () =>
      list.map((c) => (
        <div key={c._id} className="rounded-2xl border bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{c.title}</h3>
            <span
              className={
                c.status === "open"
                  ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700"
                  : "rounded-full bg-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-700"
              }
            >
              {c.status}
            </span>
          </div>

          <p className="mb-3 line-clamp-2 text-sm text-gray-600">
            {c.description || "No description."}
          </p>

          <div className="mb-3 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg bg-indigo-50 p-3">
              <div className="text-indigo-900">Ends</div>
              <div className="font-semibold text-indigo-700">
                {new Date(c.endsAt).toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg bg-indigo-50 p-3">
              <div className="text-indigo-900">Time left</div>
              <div className="font-semibold text-indigo-700">{timeLeft(c.endsAt)}</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-gray-900">Entry cost</div>
              <div className="font-semibold text-gray-700">{c.entryCost} prestige ticket(s)</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <div className="text-gray-900">Max per user</div>
              <div className="font-semibold text-gray-700">
                {c.maxTicketsPerUser || "Unlimited"}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              Entries: {c.participants?.length ?? 0}
            </div>
            <button
              disabled={c.status !== "open"}
              onClick={() => setSelected(c)}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {c.status === "open" ? "Participate" : "Closed"}
            </button>
          </div>
        </div>
      )),
    [list]
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Same header as Settings */}
      <Header />

      {/* Same background treatment as Settings/Leaderboard */}
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
          {loading && <div className="rounded-xl border bg-white/70 p-6">Loading…</div>}
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

      <ParticipateModal
        open={!!selected}
        onClose={() => setSelected(null)}
        competition={selected}
        onSuccess={() => fetchAll(filter)}
      />
    </div>
  );
};

export default CompetitionsPage;
