import React, { useEffect, useMemo, useState } from "react";
import { X, Clock, ShieldCheck, Info, Ticket, CheckCircle } from "lucide-react";

type Competition = {
  _id: string;
  title: string;
  description?: string;
  bannerUrl?: string;
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
  const a = Math.floor(Math.random() * 7) + 2; // 2..8
  const b = Math.floor(Math.random() * 7) + 2; // 2..8
  return {
    q: `Quick skill check: what is ${a} + ${b}?`,
    a: String(a + b),
  };
}

export default function ParticipationModal({
  open,
  competition,
  onClose,
  onConfirm,
  isSubmitting = false,
}: Props) {
  const [agree, setAgree] = useState(false);
  const [answer, setAnswer] = useState("");
  const [qa, setQa] = useState(() => humanQuestion());
  const correct = useMemo(() => answer.trim() === qa.a, [answer, qa.a]);

  useEffect(() => {
    if (open) {
      setAgree(false);
      setAnswer("");
      setQa(humanQuestion());
    }
  }, [open]);

  if (!open || !competition) return null;

  const c = competition;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-indigo-900">Enter Competition</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Body */}
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left: image/summary */}
          <div className="p-6 md:border-r">
            {c.bannerUrl ? (
              <img
                src={c.bannerUrl}
                alt={c.title}
                className="h-40 w-full object-cover rounded-xl mb-4"
              />
            ) : (
              <div className="h-40 w-full rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 mb-4" />
            )}

            <h4 className="text-xl font-bold text-indigo-900 mb-1">{c.title}</h4>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Ticket className="h-4 w-4" />
              <span>
                Entry: <span className="font-semibold text-indigo-700">{c.entryCost}</span>{" "}
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

          {/* Right: terms + human check */}
          <div className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-indigo-600" />
              <p className="text-sm font-medium text-indigo-800">Competition Terms</p>
            </div>

            <div className="h-32 overflow-y-auto border rounded-lg p-3 text-xs leading-5 bg-gray-50 text-gray-700 mb-4">
              <p>
                • This is a <strong>skill-based entry</strong>. No wagering or gambling.{" "}
              </p>
              <p>
                • One prestige ticket equals one entry. Entry is non-refundable after submission.
              </p>
              <p>
                • You must answer the skill question correctly for your entry to be counted.
              </p>
              <p>
                • Winners are selected fairly from eligible entries after the competition ends.
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
              />
              {answer && (
                <div className="mt-2 text-sm flex items-center gap-1">
                  {correct ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-green-700">Looks good.</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Double-check your answer.</span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => onConfirm(c)}
              disabled={!agree || !correct || isSubmitting}
              className={`w-full mt-3 rounded-lg px-4 py-3 font-semibold text-white transition
                ${!agree || !correct || isSubmitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                }`}
            >
              {isSubmitting ? "Submitting…" : "Enter Competition"}
            </button>

            <button
              onClick={onClose}
              className="w-full mt-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
