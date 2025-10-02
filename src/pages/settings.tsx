import React from "react";
import { User, Phone, MapPin, Save, Loader2 } from "lucide-react";
import Header from "../components/Header";
import { Footer } from "../components/footer";
import BackgroundImage from "../images/background-img.jpg";
import { useUser } from "../context/userContext";

const API_BASE = process.env.REACT_APP_API_URL || "https://api.scoreperks.co.uk";

type Address = {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
};

type ProfilePayload = {
  name: string;
  phone?: string;
  address?: Address;
};

function toAddressString(a?: Partial<Address> | null) {
  if (!a) return "—";
  return [a.line1, a.line2, a.city, a.state, a.postcode, a.country]
    .filter(Boolean)
    .join(", ");
}

export default function Settings() {
  const { user, refreshUser } = useUser();

  // Seed fields from user (fallbacks included)
  const [name, setName] = React.useState<string>(
    (user as any)?.name ||
      (user as any)?.fullName ||
      (user as any)?.username ||
      ""
  );
  const [phone, setPhone] = React.useState<string>((user as any)?.phone || "");
  const [addr, setAddr] = React.useState<Address>({
    line1: (user as any)?.address?.line1 || "",
    line2: (user as any)?.address?.line2 || "",
    city: (user as any)?.address?.city || "",
    state: (user as any)?.address?.state || "",
    postcode: (user as any)?.address?.postcode || "",
    country: (user as any)?.address?.country || "",
  });

  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);

  // Simple validation
  const phoneOk =
    !phone ||
    /^[+]?[\d\s()-]{7,}$/.test(phone); // permissive but avoids obvious junk
  const nameOk = name.trim().length >= 2;
  const addressOk = addr.line1.trim().length > 0 && addr.city.trim().length > 0 && addr.postcode.trim().length > 0 && addr.country.trim().length > 0;

  const dirty =
    name !== ((user as any)?.name || (user as any)?.fullName || (user as any)?.username || "") ||
    phone !== ((user as any)?.phone || "") ||
    addr.line1 !== ((user as any)?.address?.line1 || "") ||
    (addr.line2 || "") !== ((user as any)?.address?.line2 || "") ||
    addr.city !== ((user as any)?.address?.city || "") ||
    (addr.state || "") !== ((user as any)?.address?.state || "") ||
    addr.postcode !== ((user as any)?.address?.postcode || "") ||
    addr.country !== ((user as any)?.address?.country || "");

  const canSave = !saving && dirty && nameOk && phoneOk && addressOk;

  // Save handler: tries /api/users/me then falls back to /api/profile
  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError(null);

    const token = localStorage.getItem("token") || "";
    const payload: ProfilePayload = {
      name: name.trim(),
      phone: phone.trim() || undefined,
      address: {
        line1: addr.line1.trim(),
        line2: addr.line2?.trim() || "",
        city: addr.city.trim(),
        state: addr.state?.trim() || "",
        postcode: addr.postcode.trim(),
        country: addr.country.trim(),
      },
    };

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    async function tryPut(url: string) {
      const res = await fetch(url, {
        method: "PUT",
        headers,
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    }

    try {
      // primary
      try {
        await tryPut(`${API_BASE}/api/users/me`);
      } catch {
        // fallback
        await tryPut(`${API_BASE}/api/profile`);
      }
      await refreshUser?.();
      setSavedAt(new Date());
    } catch (e: any) {
      setError(e?.message || "Could not save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div
        className="relative flex-grow bg-cover bg-center"
        style={{ backgroundImage: `url(${BackgroundImage})` }}
      >
        <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-sm" />

        <div className="relative py-6 px-6 sm:px-8 lg:px-10 w-full max-w-6xl mx-auto">
          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-slate-900">
              Settings
            </h1>
            <p className="text-slate-600">
              Review and update your profile details.
            </p>
          </div>

          {/* Content: 2 cols on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form card */}
            <div className="lg:col-span-2 bg-white/90 rounded-2xl border border-indigo-100 p-6 shadow-sm">
              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-600" />
                    <input
                      type="text"
                      className={`w-full rounded-lg border px-9 py-2 outline-none ${
                        nameOk
                          ? "border-slate-200 focus:ring-2 focus:ring-indigo-200"
                          : "border-red-300 focus:ring-2 focus:ring-red-200"
                      }`}
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {!nameOk && (
                    <p className="mt-1 text-xs text-red-600">
                      Please enter at least 2 characters.
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Contact number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-600" />
                    <input
                      type="tel"
                      className={`w-full rounded-lg border px-9 py-2 outline-none ${
                        phoneOk
                          ? "border-slate-200 focus:ring-2 focus:ring-indigo-200"
                          : "border-red-300 focus:ring-2 focus:ring-red-200"
                      }`}
                      placeholder="+1 555 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  {!phoneOk && (
                    <p className="mt-1 text-xs text-red-600">
                      Please enter a valid phone number.
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Address
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2 relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-600" />
                      <input
                        type="text"
                        className="w-full rounded-lg border border-slate-200 px-9 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                        placeholder="Address line 1"
                        value={addr.line1}
                        onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
                      />
                    </div>
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Address line 2 (optional)"
                      value={addr.line2}
                      onChange={(e) => setAddr({ ...addr, line2: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="City"
                      value={addr.city}
                      onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="State / Province"
                      value={addr.state}
                      onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Postcode"
                      value={addr.postcode}
                      onChange={(e) => setAddr({ ...addr, postcode: e.target.value })}
                    />
                    <input
                      type="text"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200"
                      placeholder="Country"
                      value={addr.country}
                      onChange={(e) => setAddr({ ...addr, country: e.target.value })}
                    />
                  </div>

                  {!addressOk && (
                    <p className="mt-1 text-xs text-red-600">
                      Please fill line 1, city, postcode and country.
                    </p>
                  )}
                </div>

                {/* Actions */}
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={onSave}
                    disabled={!canSave}
                    className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" /> Save changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      // reset to user values
                      setName(
                        (user as any)?.name ||
                          (user as any)?.fullName ||
                          (user as any)?.username ||
                          ""
                      );
                      setPhone((user as any)?.phone || "");
                      setAddr({
                        line1: (user as any)?.address?.line1 || "",
                        line2: (user as any)?.address?.line2 || "",
                        city: (user as any)?.address?.city || "",
                        state: (user as any)?.address?.state || "",
                        postcode: (user as any)?.address?.postcode || "",
                        country: (user as any)?.address?.country || "",
                      });
                      setError(null);
                    }}
                    className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  {savedAt && (
                    <span className="text-xs text-slate-500">
                      Saved at {savedAt.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Review / Preview card */}
            <div className="bg-white/90 rounded-2xl border border-indigo-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-indigo-900 mb-3">
                Preview
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-slate-500">Name</div>
                  <div className="font-semibold text-slate-900">
                    {name || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Contact</div>
                  <div className="font-semibold text-slate-900">
                    {phone || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500">Address</div>
                  <div className="font-semibold text-slate-900">
                    {toAddressString(addr)}
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50/60 p-3 text-xs text-indigo-800">
                Tip: Make sure your address is accurate for prize deliveries.
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
