import React, { useEffect, useMemo, useState } from "react";
import { uploadImageToCloudinary } from "../../helpers/cloudinary"; // <-- add this

// ===== CONFIG (no import.meta) =====
const API_BASE = "https://api.scoreperks.co.uk";

// ===== TYPES aligned to your backend =====
export type CompetitionStatus = "open" | "closed";

export interface Competition {
  _id: string;
  title: string;
  description?: string;
  endsAt: string; // ISO string
  entryCost: number; // integer ≥1
  maxTicketsPerUser: number; // 0 = unlimited
  status: CompetitionStatus; // "open" | "closed"
  participants?: Array<{ ticketId: string; userId: string }>;
  winner?: { ticketId: string; userId: string } | null;
  images?: string[]; // <-- NEW: cover(s)
  createdAt?: string;
  updatedAt?: string;
}

// ===== Small fetch helper using your token format =====
async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* no body */
  }
  if (!res.ok) {
    const message = data?.error || data?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}

// ===== Data hook =====
function useCompetitions() {
  const [data, setData] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await http<Competition[]>("/api/competitions");
      setData(list);
    } catch (e: any) {
      setError(e.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);
  return { data, loading, error, refetch };
}

// ===== Utilities =====
function classNames(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

// ===== Create Competition Modal =====
interface FormProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const CompetitionForm: React.FC<FormProps> = ({ open, onClose, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [entryCost, setEntryCost] = useState<number>(1);
  const [maxTicketsPerUser, setMaxTicketsPerUser] = useState<number>(0);

  // NEW: images state
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  // reset form when modal opens
  useEffect(() => {
    if (open) {
      setErr(null);
      setTitle("");
      setDescription("");
      setEndsAt("");
      setEntryCost(1);
      setMaxTicketsPerUser(0);
      setFiles([]);
      setPreviews([]);
      setUploading(false);
    }
  }, [open]);

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []).slice(0, 4); // limit 4
    setFiles(list);
    const urls = list.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErr(null);

    try {
      // 1) upload images to Cloudinary (if any)
      let imageUrls: string[] = [];
      if (files.length) {
        setUploading(true);
        imageUrls = await Promise.all(
          files.map((f) => uploadImageToCloudinary(f, "competitions"))
        );
        setUploading(false);
      }

      // 2) create competition with image URLs
      const payload = {
        title,
        description,
        endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
        entryCost,
        maxTicketsPerUser,
        images: imageUrls, // <-- NEW
      };

      await http<Competition>(`/api/competitions`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      onSaved();
      onClose();
    } catch (e: any) {
      setErr(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create Competition</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
        {err && (
          <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {err}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">
              Entry Cost (tickets)
            </label>
            <input
              type="number"
              min={1}
              value={entryCost}
              onChange={(e) => setEntryCost(parseInt(e.target.value || "1"))}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Ends At</label>
            <input
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
              className="mt-1 w-full rounded-lg border p-2"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must be a future date/time
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Max Tickets / User
            </label>
            <input
              type="number"
              min={0}
              value={maxTicketsPerUser}
              onChange={(e) =>
                setMaxTicketsPerUser(parseInt(e.target.value || "0"))
              }
              className="mt-1 w-full rounded-lg border p-2"
            />
            <p className="mt-1 text-xs text-gray-500">0 = unlimited</p>
          </div>

          {/* NEW: Images */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium">Images (max 4)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onPickFiles}
              className="mt-1"
            />
            {!!previews.length && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    className="h-20 w-full rounded object-cover"
                    alt={`preview-${i}`}
                    onLoad={(e) =>
                      URL.revokeObjectURL((e.target as HTMLImageElement).src)
                    }
                  />
                ))}
              </div>
            )}
            {uploading && (
              <p className="mt-1 text-xs text-indigo-600">Uploading images…</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2"
          >
            Cancel
          </button>
          <button
            disabled={saving || uploading}
            className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {saving ? "Saving..." : "Create competition"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ===== Simple button component =====
const ActionButton: React.FC<
  React.PropsWithChildren<{
    onClick?: () => void;
    variant?: "ghost" | "primary" | "danger";
  }>
> = ({ children, onClick, variant = "ghost" }) => (
  <button
    onClick={onClick}
    className={classNames(
      "rounded-lg px-3 py-1.5 text-sm",
      variant === "primary" && "bg-indigo-600 text-white hover:bg-indigo-700",
      variant === "danger" && "bg-red-600 text-white hover:bg-red-700",
      variant === "ghost" && "hover:bg-gray-100"
    )}
  >
    {children}
  </button>
);

// ===== Main Page =====
const AdminCompetitionsPage: React.FC = () => {
  const { data, loading, error, refetch } = useCompetitions();
  const [formOpen, setFormOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const sorted = useMemo(
    () =>
      (data ?? [])
        .slice()
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")),
    [data]
  );

  const endCompetition = async (id: string) => {
    setBusyId(id);
    setToast(null);
    try {
      await http(`/api/competitions/${id}/end`, { method: "POST" });
      setToast("Competition ended and winner selected");
      await refetch();
    } catch (e: any) {
      setToast(e.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin · Competitions</h1>
          <p className="text-sm text-gray-500">
            Create competitions, then end them to select a winner.
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="rounded-2xl bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          + New Competition
        </button>
      </div>

      {toast && (
        <div className="mb-4 rounded-lg bg-gray-900 px-4 py-3 text-sm text-white">
          {toast}
        </div>
      )}

      {loading && <div className="rounded-lg border p-6">Loading...</div>}
      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50 text-left text-sm">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Ends At</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Participants</th>
                <th className="px-4 py-3">Winner</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sorted.map((c) => (
                <tr key={c._id} className="text-sm">
                  <td className="px-4 py-3">
                    <div className="font-medium flex items-center gap-3">
                      {/* tiny cover if available */}
                      {c.images?.[0] && (
                        <img
                          src={c.images[0]}
                          alt=""
                          className="h-8 w-12 rounded object-cover"
                        />
                      )}
                      <span>{c.title}</span>
                    </div>
                    <div className="text-gray-500 truncate max-w-[22ch]">
                      {c.description || ""}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {c.endsAt ? new Date(c.endsAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={classNames(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        c.status === "open" && "bg-green-100 text-green-700",
                        c.status === "closed" && "bg-gray-200 text-gray-700"
                      )}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{c.participants?.length ?? 0}</td>
                  <td className="px-4 py-3">
                    {c.winner ? (
                      <div className="text-xs">
                        <div className="font-medium">
                          Ticket: {c.winner?.ticketId}
                        </div>
                        <div>User: {c.winner?.userId}</div>
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {c.status === "open" ? (
                        <ActionButton
                          variant="danger"
                          onClick={() => endCompetition(c._id)}
                        >
                          {busyId === c._id ? "…" : "End & Draw"}
                        </ActionButton>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    No competitions yet. Create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <CompetitionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={refetch}
      />
    </div>
  );
};

export default AdminCompetitionsPage;
