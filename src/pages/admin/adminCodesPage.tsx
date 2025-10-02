import React, { useRef, useState } from "react";

// Keep identical to your other pages
const API_BASE = "https://api.scoreperks.co.uk";

function getToken() {
  try { return localStorage.getItem("token") || ""; } catch { return ""; }
}
function cls(...c: Array<string | false | undefined>) { return c.filter(Boolean).join(" "); }

async function uploadCodesFile(file: File) {
  const fd = new FormData();
  fd.append("file", file); // key must be 'file'

  const res = await fetch(`${API_BASE}/api/points/upload-codes`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` }, // no Content-Type; browser sets boundary
    body: fd,
  });

  const text = await res.text().catch(() => "");
  try {
    const json = JSON.parse(text);
    if (!res.ok) throw new Error(json?.error || json?.message || `HTTP ${res.status}`);
    return typeof json === "string" ? json : JSON.stringify(json, null, 2);
  } catch {
    if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
    return text;
  }
}

async function testRedeem(code: string) {
  const res = await fetch(`${API_BASE}/api/points/redeem-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ code: code.trim() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || data?.message || `HTTP ${res.status}`);
  return JSON.stringify(data, null, 2);
}

const AdminCodesPage: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isDragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadOut, setUploadOut] = useState<string | null>(null);
  const [uploadErr, setUploadErr] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [testing, setTesting] = useState(false);
  const [testOut, setTestOut] = useState<string | null>(null);
  const [testErr, setTestErr] = useState<string | null>(null);

  const pick = (f?: File) => {
    if (!f) return;
    setSelectedFile(f);
    setUploadOut(null);
    setUploadErr(null);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin · Submit Codes</h1>
        <p className="text-sm text-gray-500">Upload CSV/TXT to create codes. Optional: test a single code.</p>
      </div>

      {/* Upload */}
      <div className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Upload codes file</h2>
        <p className="mb-4 text-sm text-gray-600">
          Field name must be <code>file</code>. Formats: one code per line (TXT) or CSV with a <code>code</code> column.
        </p>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files?.[0] || undefined); }}
          className={cls(
            "flex h-40 items-center justify-center rounded-xl border-2 border-dashed",
            isDragging ? "border-indigo-400 bg-indigo-50" : "border-gray-300"
          )}
        >
          <div className="text-center">
            <p className="text-sm text-gray-700">
              Drag & drop, or{" "}
              <button type="button" className="font-semibold text-indigo-600 underline" onClick={() => inputRef.current?.click()}>
                browse
              </button>
            </p>
            <p className="mt-1 text-xs text-gray-500">Accepted: .csv, .txt</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.txt"
            className="hidden"
            onChange={(e) => pick(e.target.files?.[0] || undefined)}
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {selectedFile
              ? <>Selected: <span className="font-medium">{selectedFile.name}</span> ({Math.round(selectedFile.size / 1024)} KB)</>
              : <span className="text-gray-500">No file selected</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-xl border px-4 py-2 text-sm"
              onClick={() => { setSelectedFile(null); setUploadOut(null); setUploadErr(null); }}
            >
              Clear
            </button>
            <button
              type="button"
              disabled={!selectedFile || uploading}
              onClick={async () => {
                if (!selectedFile) return;
                setUploading(true); setUploadErr(null); setUploadOut(null);
                try {
                  const out = await uploadCodesFile(selectedFile);
                  setUploadOut(out);
                  setSelectedFile(null);
                } catch (e: any) {
                  setUploadErr(e.message || "Upload failed");
                } finally { setUploading(false); }
              }}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
        </div>

        {uploadErr && <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{uploadErr}</div>}
        {uploadOut && (
          <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-white">{uploadOut}</pre>
        )}
      </div>

      {/* Test redeem */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Test a code (optional)</h2>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            className="w-full rounded-lg border p-2"
            placeholder="Enter a code to test"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            type="button"
            disabled={!code.trim() || testing}
            onClick={async () => {
              setTesting(true); setTestErr(null); setTestOut(null);
              try { setTestOut(await testRedeem(code)); }
              catch (e: any) { setTestErr(e.message || "Redeem failed"); }
              finally { setTesting(false); }
            }}
            className="rounded-xl bg-gray-800 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {testing ? "Testing…" : "Test redeem"}
          </button>
        </div>

        {testErr && <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{testErr}</div>}
        {testOut && <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-white">{testOut}</pre>}
      </div>
    </div>
  );
};

export default AdminCodesPage;
