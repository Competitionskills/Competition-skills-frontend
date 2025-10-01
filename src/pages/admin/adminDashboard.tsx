import React, { useState } from "react";
import AdminCompetitionsPage from "./adminCompetitionPage";
import AdminCodePage from "./AdminCodePage";

const AdminPage: React.FC = () => {
  const [tab, setTab] = useState<"competitions" | "code">("competitions");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("competitions")}
          className={`px-4 py-2 rounded ${
            tab === "competitions" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Competitions
        </button>
        <button
          onClick={() => setTab("code")}
          className={`px-4 py-2 rounded ${
            tab === "code" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Code
        </button>
      </div>

      {/* Render tab content */}
      {tab === "competitions" && <AdminCompetitionsPage />}
      {tab === "code" && <AdminCodePage />}
    </div>
  );
};

export default AdminPage;
