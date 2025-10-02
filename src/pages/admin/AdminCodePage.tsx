import React, { useState, useRef } from "react";

// Use your live API
const API_BASE = "https://api.scoreperks.co.uk/api";

const AdminCodePage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setMessage("");
    setStatus("idle");
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setMessage("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please choose a CSV file first.");
      setStatus("error");
      return;
    }
    try {
      setStatus("uploading");
      setMessage("");

      const form = new FormData();
      // backend expects the key to be exactly "file"
      form.append("file", file, file.name);

      // optional auth header if you store a JWT
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/points/upload-codes`, {
        method: "POST",
        body: form, // let the browser set multipart boundaries
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        // If your API needs cookies: credentials: "include",
      });

      const text = await res.text(); // server might return plain text like "1"
      if (!res.ok) throw new Error(text || `Upload failed with ${res.status}`);

      setStatus("done");
      setMessage(text || "Uploaded successfully.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err?.message || "Upload failed.");
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Upload Codes (CSV)</h2>

      <div className="flex items-center gap-3 mb-4">
        <input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onPickFile}
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={handleUpload}
          disabled={status === "uploading"}
          className={`px-4 py-2 rounded ${
            status === "uploading" ? "bg-gray-400 text-white" : "bg-blue-600 text-white"
          }`}
        >
          {status === "uploading" ? "Uploading..." : "Upload"}
        </button>
        <button onClick={reset} className="px-3 py-2 rounded bg-gray-200">
          Reset
        </button>
      </div>

      {file && (
        <p className="text-sm text-gray-600 mb-2">
          Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)
        </p>
      )}

      {status === "done" && (
        <div className="p-3 rounded bg-green-50 border border-green-200 text-green-800">
          {message || "Upload complete."}
        </div>
      )}
      {status === "error" && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800">
          {message || "Something went wrong."}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-6">
        Endpoint: <code>{API_BASE}/points/upload-codes</code> (form-data key: <code>file</code>)
      </p>
    </div>
  );
};

export default AdminCodePage;
