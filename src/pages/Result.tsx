// src/pages/Results.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Crown, Loader2, AlertTriangle } from "lucide-react";
import { getCompetitionPhase } from "../utils/competition";
import { useUser } from "../context/userContext";

type Participant = { ticketId: string; userId: string };
type CompetitionDoc = {
  _id: string;
  title: string;
  description?: string;
  endsAt: string;
  status: "open" | "closed";
  participants?: Participant[];
  winner?: { ticketId: string; userId: string; name?: string | null; email?: string | null } | null;
  winnerName?: string | null;   // enriched by backend
  winnerEmail?: string | null;  // enriched by backend
};

const API_BASE = process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk";
const SUPPORT_EMAIL = process.env.REACT_APP_SUPPORT_EMAIL || "support@scoreperks.co.uk";

// util: normalize many possible id shapes to a string
const normalizeId = (v: any) =>
  String(v?._id ?? v?.id ?? v?.userId ?? (typeof v === "object" ? v?.toString?.() : v) ?? "");

// display helpers
const mask = (s: string) => (s.length > 8 ? `${s.slice(0, 4)}…${s.slice(-4)}` : s);
const maskEmail = (e: string) => {
  const [u, d] = e.split("@");
  if (!d) return e;
  const uu = u.length <= 2 ? u : `${u[0]}***${u[u.length - 1]}`;
  return `${uu}@${d}`;
};

export default function Results() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser(); // ✅ hooks only inside the component

  // state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comp, setComp] = useState<CompetitionDoc | null>(null);

  // load competition
  useEffect(() => {
    if (!id) {
      setError("Missing competition id.");
      setLoading(false);
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_BASE}/api/competitions/${id}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setComp({
          _id: data._id,
          title: data.title,
          description: data.description,
          endsAt: data.endsAt,
          status: data.status,
          participants: data.participants ?? [],
          winner: data.winner ?? null,
          winnerName: data.winnerName ?? null,
          winnerEmail: data.winnerEmail ?? null,
        });
      } catch (e: any) {
        setError(e.message || "Failed to load result");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // derived values
  const participants: Participant[] = comp?.participants ?? [];
  const currentUserId = normalizeId(user || localStorage.getItem("userId") || "");
  const winnerUserId = comp?.winner?.userId ?? null;

  const winnerDisplayName = useMemo(() => {
    if (!comp) return "";
    const n = comp.winnerName ?? comp.winner?.name ?? null;
    if (n) return n;
    const email = comp.winnerEmail ?? comp.winner?.email ?? null;
    if (email) return maskEmail(email);
    if (winnerUserId) {
      const p = participants.find((pp) => String(pp.userId) === String(winnerUserId));
      if ((p as any)?.user?.name) return (p as any).user.name;
      if ((p as any)?.user?.email) return maskEmail((p as any).user.email);
      return `User ${mask(String(winnerUserId))}`;
    }
    return "—";
  }, [comp, participants, winnerUserId]);

  const didEnter = useMemo(
    () => !!currentUserId && participants.some((p) => String(p.userId) === String(currentUserId)),
    [participants, currentUserId]
  );

  const isWinner = !!winnerUserId && String(winnerUserId) === String(currentUserId);

  const totalEntries = participants.length;
  const uniqueUsers = useMemo(() => {
    const s = new Set(participants.map((p) => String(p.userId)));
    return s.size;
  }, [participants]);

  const phase = getCompetitionPhase({
    _id: comp?._id || (id ?? ""),
    title: comp?.title || "",
    endsAt: comp?.endsAt || new Date().toISOString(),
  }).phase;

  // handlers
  const handleContactSupport = () => {
    if (!comp) return;
    const subject = encodeURIComponent(`Prize claim: ${comp.title} (${comp._id})`);
    const body = encodeURIComponent(
      [
        "Hi ScorePerks team,",
        "",
        `I am the winner of "${comp.title}". Please advise the next steps to claim my prize.`,
        "",
        `Details:`,
        `- Competition ID: ${comp._id}`,
        `- Ticket ID: ${comp.winner?.ticketId ?? ""}`,
        `- My user ID: ${currentUserId}`,
        `- Registered email: ${(user as any)?.email ?? comp.winnerEmail ?? ""}`,
        "",
        "Thanks!"
      ].join("\n")
    );
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };

  // render
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-3 text-indigo-900">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p>Loading result…</p>
        </div>
      </div>
    );
  }

  if (error || !comp) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span>{error ?? "No data"}</span>
        </div>
      </div>
    );
  }

  const isFinalised = phase === "ended" && comp.status === "closed" && !!comp.winner;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-4">
        <Crown className="h-7 w-7 text-yellow-500" />
        <h1 className="text-2xl font-extrabold text-indigo-900">Competition Result</h1>
      </div>

      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-xl font-bold text-indigo-900">{comp.title}</h2>
        <p className="text-sm text-gray-600 mt-1">
          Ended: {new Date(comp.endsAt).toLocaleString()}
        </p>

        {/* Personalized message */}
        {isFinalised && (
          <>
            {isWinner ? (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                🎉 <span className="font-semibold">Congratulations!</span> You are the winner!{" "}
                <span className="text-gray-700">Ticket:</span> {comp.winner!.ticketId}
                {/* Contact button shown ONLY to the winner when finalised */}
                <div className="mt-3">
                  <button
                    onClick={handleContactSupport}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    Contact us to claim prize
                  </button>
                </div>
              </div>
            ) : didEnter ? (
              <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-indigo-800">
                Sorry, better luck next time. Thanks for participating! 🙌
              </div>
            ) : (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-700">
                You didn’t enter this competition. Check out the latest ones on the dashboard.
              </div>
            )}
          </>
        )}

        {/* Status messages for not ended / not drawn */}
        {phase !== "ended" && (
          <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-yellow-800 text-sm">
            This competition hasn’t ended yet. Results will be available after it ends.
          </div>
        )}
        {phase === "ended" && comp.status !== "closed" && !comp.winner && (
          <div className="mt-4 rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-indigo-800 text-sm">
            The draw hasn’t been run yet. Please check back later.
          </div>
        )}

        {/* Winner block */}
        {comp.status === "closed" && comp.winner && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="text-sm text-gray-600">Winner</div>
            <div className="text-lg font-semibold text-emerald-800">
              {winnerDisplayName}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              Ticket: {comp.winner.ticketId}
            </div>

            {/* Redundant contact CTA inside winner block for the winner */}
            {isWinner && (
              <div className="mt-3">
                
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="text-gray-500">Total entries</div>
            <div className="text-indigo-900 font-bold">{totalEntries}</div>
          </div>
          <div className="rounded-lg border bg-gray-50 p-3">
            <div className="text-gray-500">Unique participants</div>
            <div className="text-indigo-900 font-bold">{uniqueUsers}</div>
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-block rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
