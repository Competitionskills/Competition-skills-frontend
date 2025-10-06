// src/components/participationModal.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  X, Clock, ShieldCheck, Info, Ticket, CheckCircle, Trophy, AlertTriangle,
} from "lucide-react";

type Competition = {
  _id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
  images?: string[];
  startsAt?: string;
  endsAt: string;
  entryCost: number;
  participants?: { ticketId: string; userId: string }[];
};

type Props = {
  open: boolean;
  competition: Competition | null;
  onClose: () => void;
  onConfirm: (competition: Competition) => Promise<void> | void;
  isSubmitting?: boolean;
};

function humanQuestion() {
  const a = Math.floor(Math.random() * 7) + 2;
  const b = Math.floor(Math.random() * 7) + 2;
  return { q: `Quick skill check: what is ${a} + ${b}?`, a: String(a + b) };
}

const ParticipationModal: React.FC<Props> = ({
  open,
  competition,
  onClose,
  onConfirm,
  isSubmitting = false,
}) => {
  const [agree, setAgree] = useState(false);
  const [answer, setAnswer] = useState("");
  const [qa, setQa] = useState(() => humanQuestion());
  const correct = useMemo(() => answer.trim() === qa.a, [answer, qa.a]);

  const [phase, setPhase] = useState<"form" | "success">("form");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // lock page scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    const prevPadding = document.body.style.paddingRight;
    // naive scrollbar compensation (optional)
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarW > 0) document.body.style.paddingRight = `${scrollbarW}px`;
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPadding;
    };
  }, [open]);

  // reset state when opened
  useEffect(() => {
    if (open) {
      setPhase("form");
      setAgree(false);
      setAnswer("");
      setQa(humanQuestion());
      setErrorMsg(null);
      setSubmitting(false);
    }
  }, [open]);

  if (!open || !competition) return null;
  const c = competition;

  const handleConfirm = async () => {
    if (!agree || !correct) return;
    setErrorMsg(null);
    setSubmitting(true);
    try {
      await onConfirm(c);
      setPhase("success");
    } catch (e: any) {
      const msg =
        e?.message ||
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Could not enter the competition.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const disabled = !agree || !correct || submitting || isSubmitting;

  return (
    <div
      className={`
        fixed inset-0 z-[100]
        bg-black/60 backdrop-blur-sm
        flex items-end sm:items-center justify-center
        p-0 sm:p-6
        h-[100dvh] overscroll-contain
      `}
      role="dialog"
      aria-modal="true"
    >
      {/* click outside to close (desktop) */}
      <button
        aria-hidden
        onClick={onClose}
        className="hidden sm:block absolute inset-0 -z-10"
        tabIndex={-1}
      />

      <div
        className={`
          w-full sm:max-w-3xl
          bg-white shadow-2xl
          rounded-t-2xl sm:rounded-2xl
          sm:mx-auto
          // make the PANEL scrollable
          max-h-[100dvh] sm:max-h-[90vh]
          h-auto sm:h-auto
          flex flex-col
          pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]
        `}
      >
        {/* Sticky header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-indigo-900">
              {phase === "form" ? "Enter Competition" : "Entry Confirmed"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {phase === "form" ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left */}
              <div>
                {(() => {
                  const cover = c.bannerUrl || c.images?.[0];
                  return cover ? (
                    <img
                      src={cover}
                      alt={c.title}
                      className="h-40 w-full object-cover rounded-xl mb-4"
                    />
                  ) : (
                    <div className="h-40 w-full rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 mb-4" />
                  );
                })()}

                <h4 className="text-xl font-bold text-indigo-900 mb-1">
                  {c.title}
                </h4>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <Ticket className="h-4 w-4" />
                  <span>
                    Entry:{" "}
                    <span className="font-semibold text-indigo-700">
                      {c.entryCost}
                    </span>{" "}
                    prestige ticket{c.entryCost > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Ends: {new Date(c.endsAt).toLocaleString()}</span>
                </div>

                {c.description && (
                  <p className="mt-4 text-sm text-gray-700">{c.description}</p>
                )}
              </div>

              {/* Right */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-indigo-600" />
                  <p className="text-sm font-medium text-indigo-800">
                    Competition Terms
                  </p>
                </div>

                {/* Let the main panel scroll; no fixed height here */}
                <div className="overflow-hidden rounded-lg border bg-gray-50 p-3 text-xs leading-5 text-gray-700 mb-4">
                  <p>
                    • This is a <strong>skill-based entry</strong>. No wagering
                    or gambling.
                  </p>
                  <p>
                    • One prestige ticket equals one entry. Entry is
                    non-refundable after submission.
                  </p>
                  <p>
                    • You must answer the skill question correctly for your
                    entry to be counted.
                  </p>
                  <p>
                    • Winners are selected fairly from eligible entries after
                    the competition ends.
                  </p>
                  <p>• Misuse or abuse may result in disqualification.</p>
                </div>

                <label className="flex items-start gap-3 mb-5 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">
                    I’ve read and agree to the competition terms.
                  </span>
                </label>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    {qa.q}
                  </label>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer"
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    inputMode="numeric"
                  />
                  {answer && (
                    <div className="mt-2 text-sm flex items-center gap-1">
                      {correct ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-green-700">Looks good.</span>
                        </>
                      ) : (
                        <span className="text-gray-500">
                          Double-check your answer.
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {errorMsg && (
                  <div className="mb-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-[2px]" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-2">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <Trophy className="h-7 w-7 text-green-600" />
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900">
                  You're in! 🎉
                </h4>
                <p className="mt-2 text-slate-600">
                  Your entry to{" "}
                  <span className="font-semibold text-indigo-700">{c.title}</span>{" "}
                  was successful.
                </p>

                <div className="mt-6 w-full rounded-xl border bg-indigo-50 p-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-indigo-900">
                      <div className="font-semibold">Competition</div>
                      <div>{c.title}</div>
                    </div>
                    <div className="text-sm text-indigo-900">
                      <div className="font-semibold">Entry Cost</div>
                      <div>
                        {c.entryCost} prestige ticket{c.entryCost > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                  <button
                    onClick={onClose}
                    className="inline-flex justify-center rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky footer actions (kept simple) */}
        {phase === "form" && (
          <div className="px-5 sm:px-6 py-4 border-t bg-white sticky bottom-0 rounded-b-2xl">
            <button
              onClick={handleConfirm}
              disabled={disabled}
              className={`w-full rounded-lg px-4 py-3 font-semibold text-white transition
                ${
                  disabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                }`}
            >
              {submitting || isSubmitting ? "Submitting…" : "Enter Competition"}
            </button>
            <button
              onClick={onClose}
              className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticipationModal;
